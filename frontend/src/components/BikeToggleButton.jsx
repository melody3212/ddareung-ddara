import { Bicycle } from "phosphor-react";
import Button from "./Button"; // Button 컴포넌트 불러오기
import "../assets/MapButtons.css";

const BikeToggleButton = ({ onClick, active, className }) => {
  return (
    <Button
      onClick={onClick}
      iconOnly
      circle
      className={`${active ? "active" : ""} ${className}`}
      // 여기서 active랑 station class 같이 들어감
    >
      <Bicycle size={24} weight="bold" />
    </Button>
  );
};

export default BikeToggleButton;


