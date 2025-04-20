import { useEffect, useState } from "react";
import { Map, MapMarker, Polyline } from "react-kakao-maps-sdk";
import Button from "../components/Button";
import SlidePanel from "../components/SlidePanel";
import "../assets/MapPage.css";
import MapButtons from "../components/MapButtons";

const MapPage = ({ currentIndex, setCurrentIndex }) => {
  // 지도 중심 좌표 상태 (초기값: 서울시청)
  const [center, setCenter] = useState({
    lat: 37.5665,
    lng: 126.9780,
  });

  // 내 위치 가져오기 버튼 핸들러
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCenter({ lat: latitude, lng: longitude }); // 지도 중심 갱신
        },
        (err) => {
          console.error("위치 접근 실패: ", err);
          alert("위치 정보를 불러올 수 없습니다.");
        }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
  };

  // 따릉이 마커 on/off 상태
  const [showStations, setShowStations] = useState(true);

  // 따릉이 대여소 데이터
  const [stationData, setStationData] = useState([]);

  // 자전거도로 표시 on/off 상태
  const [showBikeRoads, setShowBikeRoads] = useState(true);

  // 자전거도로 경로 배열
  const [bikePaths, setBikePaths] = useState([]);

  // 따릉이 데이터 불러오기
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const res = await fetch(
          "http://openapi.seoul.go.kr:8088/6241416f717364613130344152777651/json/bikeStationMaster/1/1000/"
        );
        const data = await res.json();
        setStationData(data.bikeStationMaster.row);
      } catch (error) {
        console.error("따릉이 대여소 데이터 불러오기 실패:", error);
      }
    };
    fetchStations();
  }, []);

  // 자전거도로 GeoJSON 불러오기
  useEffect(() => {
    //자전거도로 type (하천변/도로변)
    const getCourseType = (raw) => {
        if (!raw) return "기타";
      
        // 하천/공원형
        if (
            raw.includes("전용도로") && !raw.includes("차도높이형")
        ) return "하천/공원형";
      
        if (
            raw.includes("전용차로") || // 자전거전용차로
            raw.includes("겸용도로(분리형)")
        ) return "하천/공원형";
      
        // 도로변형
        if (
            raw.includes("우선도로") ||
            raw.includes("차도높이형") ||
            raw.includes("겸용도로(비분리형)")
        ) return "도로변형";
      
        return "기타";
    };

    const fetchBikeRoads = async () => {
      try {
        const res = await fetch("/data/bikeload.geojson");
        const geojson = await res.json();

        const lines = [];

        // 🔍 test: 도로 종류 출력
        const typesSet = new Set();
        geojson.features.forEach((feature) => {
          typesSet.add(feature.properties.VALUE_03);
        });
        console.log([...typesSet]); // 종류들 배열로 출력됨

        geojson.features.forEach((feature) => {
          const rawType = feature.properties["VALUE_03"]; // 🔥 실제 필드명
          const type = getCourseType(rawType);

          if (
            feature.geometry.type === "GeometryCollection" &&
            feature.geometry.geometries
          ) {
            feature.geometry.geometries.forEach((geo) => {
              if (geo.type === "LineString") {
                const coords = geo.coordinates.map(([lng, lat]) => ({
                  lat,
                  lng,
                }));
                lines.push({ path: coords, type });
              }
            });
          }
        });

        setBikePaths(lines);
      } catch (error) {
        console.error("자전거도로 데이터 불러오기 실패:", error);
      }
    };

    fetchBikeRoads();
  }, []);

  return (
    <div className="MapPage">
      {/* 지도 본체 */}
      <Map center={center} style={{ width: "100%", height: "100%" }} level={6}>
        {/* 현재 위치 마커 */}
        <MapMarker position={center}>
          <div>현재 위치</div>
        </MapMarker>

        {/* 따릉이 대여소 마커 */}
        {showStations &&
          stationData
            .filter((s) => s.LAT !== 0 && s.LOT !== 0)
            .map((station, index) => (
              <MapMarker
                key={`${station.RNTLS_ID}-${index}`}
                position={{
                  lat: Number(station.LAT),
                  lng: Number(station.LOT),
                }}
                title={station.ADDR2 || station.ADDR1}
              />
            ))}

        {/* 자전거도로 폴리라인 표시 */}
        {showBikeRoads &&
          bikePaths.map(({ path, type }, idx) => (
            <Polyline
              key={idx} //각 경로마다 고유 키
              path={path} //지도에 그릴 좌표 배열
              strokeWeight={4} //선 굵기
              strokeColor={
                type === "하천/공원형"
                  ? "green"
                  : type === "도로변형"
                  ? "gray"
                  : "red" //기타는 회색
              }
              strokeOpacity={0.45} //선 투명도
              strokeStyle="solid" //선 스타일
            />
          ))}
      </Map>

      {/* 지도 위 버튼들 (따릉이 토글, 내 위치 등) */}
      <MapButtons
        showStations={showStations}
        setShowStations={setShowStations}
        onMyLocation={handleMyLocation}
        showBikeRoads={showBikeRoads}
        setShowBikeRoads={setShowBikeRoads}
      />

      {/* 슬라이드 패널 (탭 UI) */}
      <div
        className="MapPage__SlideWrapper"
        style={{
          position: "absolute",
          bottom: "0px",
          left: 0,
          right: 0,
        }}
      >
        <SlidePanel
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>
    </div>
  );
};

export default MapPage;
