import { useNavigate, useLocation } from "react-router-dom";
import "../assets/BottomNav.css";

const BottomNav = ({setCurrentIndex }) => {
  const nav = useNavigate();
  const location = useLocation();

  const goSlideTab = (index) => {
    // 슬라이드 인덱스 설정
    setCurrentIndex(index);

    // 현재 페이지가 "/"가 아니면 MapPage로 이동
    if (location.pathname !== "/") {
      nav("/");
    }
  };

  return (
    <nav className="BottomNav">
      <button onClick={() => goSlideTab(0)}>홈</button>
      <button onClick={() => goSlideTab(1)}>저장</button>
      <button onClick={() => goSlideTab(2)}>코스</button>
      <button onClick={() => nav("/record")}>기록</button>
      <button onClick={() => nav("/mypage")}>내 정보</button>
    </nav>
  );
};

export default BottomNav;
