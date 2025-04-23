import {useState, useRef} from "react"; //드래그 상태 관리
import HomeTab from "../tabs/HomeTab";
import CourseTab from "../tabs/CourseTab";
import SaveTab from "../tabs/SaveTab";
import "../assets/SlidePanel.css";

const SlidePanel = ({ currentIndex }) => {
  const [panelHeight, setPanelHeight] = useState(window.innerHeight * 0.2); 
  // 💡 기본: 20%
  const startYRef = useRef(null); // 드래그 시작 y 좌표
  const startHeightRef = useRef(300); // 드래그 시작 시점의 슬라이드 높이

  // 드래그 시작
  const handleDragStart = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startHeightRef.current = panelHeight;
    document.addEventListener("mousemove", handleDragging);
    document.addEventListener("mouseup", handleDragEnd);
    document.addEventListener("touchmove", handleDragging);
    document.addEventListener("touchend", handleDragEnd);
  };

  // 드래그 중
  const handleDragging = (e) => {
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const deltaY = startYRef.current - clientY;
    const newHeight = Math.min(700, Math.max(50, startHeightRef.current + deltaY)); 
    // ⭐ 최대/최소 제한
    setPanelHeight(newHeight);
  };

  // 드래그 끝
  const handleDragEnd = () => {
    document.removeEventListener("mousemove", handleDragging);
    document.removeEventListener("mouseup", handleDragEnd);
    document.removeEventListener("touchmove", handleDragging);
    document.removeEventListener("touchend", handleDragEnd);
  };


  return (
    <div 
      className="SlidePanel"
      style={{ height: `${panelHeight}px` }} // ⭐ 드래그로 조절되는 높이
      >
      <div
        className="SlidePanel__dragBar"
        onMouseDown={handleDragStart}
        onTouchStart={handleDragStart}
      />
      {/* 슬라이딩 콘텐츠 래퍼 */}
      <div className="SlidePanel__wrapper">
        <div
          className="SlidePanel__inner"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, 
            // 탭 인덱스에 따라 슬라이드 이동
          }}
        >
          <div className="SlidePanel__page"><HomeTab /></div>
          <div className="SlidePanel__page"><CourseTab /></div>
          <div className="SlidePanel__page"><SaveTab /></div>
        </div>
      </div>
    </div>
  );
};

export default SlidePanel;
