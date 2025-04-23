import { Crosshair } from "phosphor-react";
import Button from "./Button";

const MyLocationToggleButton = ({ onClick, className }) => {
  return (
    <Button 
      onClick={onClick} 
      iconOnly 
      circle 
      className={className}>
      <Crosshair size={24} weight="bold" />
    </Button>
  );
};

export default MyLocationToggleButton;
