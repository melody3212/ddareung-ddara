//따릉이 마커 버튼, 내 위치 버튼, 자전거도로 표시 버튼

import BikeRoadToggleButton from "./BikeRoadToggleButton";
import BikeToggleButton from "./BikeToggleButton";
import MyLocationToggleButton from "./MyLocationToggleButton";

import "../assets/MapButtons.css";

const MapButtons = ({ showStations, setShowStations, onMyLocation, showBikeRoads, setShowBikeRoads}) => {
  return (
    <div className="MapButtons">
      {/* 자전거도로 토글 버튼 */}
      <BikeRoadToggleButton
        className="MapButtons-bikeroad"
        onClick={() => setShowBikeRoads((prev) => !prev)}
        active={showBikeRoads}
        
      />
    
      {/*따릉이 마커*/}
      <BikeToggleButton
        className="MapButtons-station"
        onClick={() => setShowStations((prev) => !prev)}
        active={showStations}/>

      {/* 내 위치 이동 버튼*/}
      <MyLocationToggleButton 
        className="MapButtons-location"
        onClick={onMyLocation} />
    </div>
  );
};

export default MapButtons;


// {/* 자전거도로 토글 버튼 */}
// <BikeRoadToggleButton
// className="MapButtons-bikeroad"
// show={showBikeRoads}
// toggle={() => setShowBikeRoads((prev) => !prev)}
// />
