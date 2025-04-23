import { useEffect, useState } from "react";
// 지도, 마커, 클러스터러, 커스텀 오버레이, 폴리라인 컴포넌트 불러오기
import { Map, MapMarker, MarkerClusterer, CustomOverlayMap, Polyline } from "react-kakao-maps-sdk";
import SlidePanel from "../components/SlidePanel";
import MapButtons from "../components/MapButtons";
// 마커 아이콘 이미지 import (src/assets 내 실제 경로 사용)
import markerImg from "../assets/images/ddareungMarker.png";
import "../assets/MapPage.css";

const MapPage = ({ currentIndex, setCurrentIndex }) => {
  // 1. 상태 정의
  const [center, setCenter] = useState({ lat: 37.5665, lng: 126.9780 }); // 지도 초기 중심: 서울시청
  const [stationData, setStationData] = useState([]); // 따릉이 대여소 데이터
  const [bikePaths, setBikePaths] = useState([]); // 자전거도로 경로 데이터
  const [recommendedPath, setRecommendedPath] = useState(null); // 추천 경로 저장
  const [showStations, setShowStations] = useState(true); // 따릉이 마커 표시 여부
  const [showBikeRoads, setShowBikeRoads] = useState(true); // 자전거도로 표시 여부
  const [selectedStation, setSelectedStation] = useState(null); // 클릭된 station 정보 저장

  // 2. 현재 위치 버튼 핸들러 (Geolocation API)
  const handleMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => {
          console.error("위치 접근 실패:", err);
          alert("위치 정보를 불러올 수 없습니다.");
        }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
  };

  // 3. 거리 계산 함수 (Haversine formula)
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const toRad = (x) => (x * Math.PI) / 180;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lng2 - lng1);
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 4. fetchStations: 1000개씩 반복 호출하여 전체 대여소 로드
  useEffect(() => {
    const fetchStations = async () => {
      const PAGE_SIZE = 1000;
      const API_KEY = import.meta.env.VITE_BIKE_API_KEY;
      let allData = [];
      let start = 1;

      while (true) {
        const end = start + PAGE_SIZE - 1;
        const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/bikeList/${start}/${end}/`;
        try {
          const res = await fetch(url);
          const data = await res.json();
          const rows = data.rentBikeStatus?.row || [];
          allData.push(...rows);
          if (rows.length < PAGE_SIZE) break; // 마지막 페이지 종료
          start += PAGE_SIZE; // 다음 청크
        } catch (err) {
          console.error(`실패한 요청: ${url}`, err);
          break;
        }
      }
      setStationData(allData);
    };
    fetchStations();
  }, []);

  // 5. 자전거도로 GeoJSON fetch 및 타입 분류
  useEffect(() => {
    const getCourseType = (raw) => {
      if (!raw) return "기타";
      if (raw.includes("전용도로") && !raw.includes("차도높이형")) return "하천/공원형";
      if (raw.includes("전용차로") || raw.includes("겸용도로(분리형)")) return "하천/공원형";
      if (raw.includes("우선도로") || raw.includes("차도높이형") || raw.includes("겸용도로(비분리형)")) return "도로변형";
      return "기타";
    };
    const fetchBikeRoads = async () => {
      try {
        const res = await fetch("/data/bikeload.geojson");
        const geojson = await res.json();
        const lines = [];
        geojson.features.forEach((feature) => {
          const type = getCourseType(feature.properties["VALUE_03"]);
          if (feature.geometry.type === "GeometryCollection") {
            feature.geometry.geometries.forEach((geo) => {
              if (geo.type === "LineString") {
                const coords = geo.coordinates.map(([lng, lat]) => ({ lat, lng }));
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

  // 6. 추천 코스 계산 후 상태 저장
  useEffect(() => {
    if (!center || bikePaths.length === 0) return;
    const riverParkPaths = bikePaths.filter((item) => item.type === "하천/공원형");
    const closest = riverParkPaths.reduce((best, cur) => {
      const dist = getDistance(center.lat, center.lng, cur.path[0].lat, cur.path[0].lng);
      return !best || dist < best.distance ? { path: cur.path, distance: dist } : best;
    }, null);
    if (closest) setRecommendedPath(closest.path);
  }, [center, bikePaths]);

  return (
    <div className="MapPage">
      <Map
        center={center}
        style={{ width: "100%", height: "100%" }}
        level={4}
        onClick={() => setSelectedStation(null)} // 지도 클릭 시 info 창 닫기
      >
        {/* 현재 위치 마커 (말풍선 없이 아이콘만) */}
        <MapMarker position={center} />

        {/* ➊ 클러스터러로 따릉이 마커 묶기 */}
        {showStations && (
          <MarkerClusterer averageCenter gridSize={60} clickable>
            {stationData
              .filter((s) => s.stationLatitude && s.stationLongitude)
              .map((station) => (
                <MapMarker
                  key={station.stationId}
                  position={{ lat: Number(station.stationLatitude), lng: Number(station.stationLongitude) }}
                  image={{ src: markerImg, size: { width: 25, height: 20 }, options: { offset: { x: 12, y: 12 } } }}
                  onClick={() => setSelectedStation(station)} // 클릭 시 해당 station 선택
                />
            ))}
          </MarkerClusterer>
        )}

        {/* ➋ 클릭된 대여소에만 커스텀 오버레이 표시 */}
        {selectedStation && (
          <CustomOverlayMap
            key={`info-${selectedStation.stationId}`}
            position={{ lat: Number(selectedStation.stationLatitude), lng: Number(selectedStation.stationLongitude) }}
            xAnchor={0.5} // 가로 중앙
            yAnchor={1.3}   // 마커 꼭대기
            clickable={false}
          >
            <div className="BikeStationinfo-window">
              <h4>{selectedStation.stationName}</h4>
              <p>남은 자전거: {selectedStation.parkingBikeTotCnt} 대</p>
            </div>
          </CustomOverlayMap>
        )}

        {/* 추천 코스 강조 */}
        {recommendedPath && (
          <Polyline
            path={recommendedPath}
            strokeWeight={6}
            strokeColor="blue"
            strokeOpacity={1}
            strokeStyle="dash"
          />
        )}

        {/* 자전거도로 폴리라인 */}
        {showBikeRoads &&
          bikePaths.map(({ path, type }, idx) => (
            <Polyline
              key={idx}
              path={path}
              strokeWeight={4}
              strokeColor={
                type === "하천/공원형" ? "green" : type === "도로변형" ? "gray" : "red"
              }
              strokeOpacity={0.45}
              strokeStyle="solid"
            />
          ))}
      </Map>

      {/* 지도 제어 버튼 */}
      <MapButtons
        showStations={showStations}
        setShowStations={setShowStations}
        onMyLocation={handleMyLocation}
        showBikeRoads={showBikeRoads}
        setShowBikeRoads={setShowBikeRoads}
      />

      {/* 슬라이드 패널 */}
      <div className="MapPage__SlideWrapper" style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <SlidePanel currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />
      </div>
    </div>
  );
};

export default MapPage;
