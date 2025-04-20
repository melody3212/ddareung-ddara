// ✅ App.jsx
import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./routes/AppRouter";
import BottomNav from "./components/BottomNav";
import "./App.css";

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0); 
  // 슬라이드 탭 인덱스 상태

  return (
    <BrowserRouter>
      {/* 전체 콘텐츠 영역 - 하단바 제외 */}
      <div style={{ 
        flex: 1, 
        position: "relative", 
        display: "flex", 
        flexDirection: "column" }}>
          
        <AppRouter
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />
      </div>

      {/* 모든 페이지에서 항상 고정된 하단바 */}
      <BottomNav
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </BrowserRouter>
  );
};

export default App;

