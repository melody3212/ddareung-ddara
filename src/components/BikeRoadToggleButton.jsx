import { MapTrifold } from "phosphor-react";
import Button from "./Button"; // 공통 Button 컴포넌트 사용
import "../assets/MapButtons.css"; // 스타일 일관성 유지

const BikeRoadToggleButton = ({ onClick, active, className }) => {
  return (
    <Button
      onClick={onClick}
      iconOnly
      circle
      className={`${active ? "active" : ""} ${className}`}
    >
      <MapTrifold size={24} weight="bold" />
    </Button>
  );
};

export default BikeRoadToggleButton;

