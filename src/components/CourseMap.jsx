import { Map, MapMarker, MapPolyline } from "react-kakao-maps-sdk";

const CourseMap = () => {
    // 지도에 표시할 경로 좌표들 (테스트용)
    const path = [
        { lat: 37.5665, lng: 126.9780 },
        { lat: 37.5700, lng: 126.9820 },
        { lat: 37.5730, lng: 126.9750 },
    ];

  return (
    <Map
        center={path[0]} // 시작점
        style={{ width: "100%", height: "400px" }}
        level={5}
    >
        <MapPolyline
            path={path}
            strokeWeight={5} // 선 두께
            strokeColor={"#00AAFF"} // 선 색상
            strokeOpacity={0.8} // 투명도
            strokeStyle={"solid"} // 실선
        />
        {/* 마커도 예시로 하나 찍어둘게 */}
        <MapMarker position={path[0]}>
            <div>출발</div>
        </MapMarker>
    </Map>
  );
};


export default CourseMap;