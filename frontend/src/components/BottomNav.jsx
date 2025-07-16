import { useNavigate, useLocation } from "react-router-dom";
import { House, BookmarkSimple, MapTrifold, ClipboardText, User, StarFour, Star } from "phosphor-react";
// Button 컴포넌트 경로는 프로젝트 구조에 맞춰 수정!
import Button from "../components/Button"; 
import "../assets/BottomNav.css";


const BottomNav = ({ setCurrentIndex, currentIndex }) => {
  const nav = useNavigate();
  const location = useLocation();

  //슬라이드 탭
  const goSlideTab = (index) => {
    setCurrentIndex(index);
    if (location.pathname !== "/") {
      nav("/");
    }
  };

  // 페이지 이동 + 인덱스 동기화 
  const handleNav = (path, index = null) => {
    if (index !== null) {
      setCurrentIndex(index);
    }
    nav(path);
  };

  return (
    <nav className="BottomNav">
      {/* 홈슬라이드 */}
      <Button
        iconOnly
        size="md"
        className={currentIndex === 0 ? "active" : ""}
        onClick={() => goSlideTab(0)}
        aria-label="홈"
      >
        <House weight={currentIndex === 0 ? "fill" : "regular"} size={24} />
      </Button>
      
      {/* 저장슬라이드 */}
      <Button
        iconOnly
        size="md"
        className={currentIndex === 1 ? "active" : ""}
        onClick={() => goSlideTab(1)}
        aria-label="저장"
      >
        <MapTrifold weight={currentIndex === 1 ? "fill" : "regular"} size={24} />
      </Button>

      {/* 코스슬라이드 */}
      <Button
        iconOnly
        size="md"
        className={currentIndex === 2 ? "active" : ""}
        onClick={() => goSlideTab(2)}
        aria-label="코스"
      >
        <Star weight={currentIndex === 2 ? "fill" : "regular"} size={24} />
      </Button>

      {/* 기록페이지 */}
      <Button
        iconOnly
        size="md"
        className={location.pathname === "/record" ? "active" : ""}
        onClick={() => handleNav("/record", 3)}
        aria-label="기록"
      >
        <ClipboardText weight={location.pathname === "/record" ? "fill" : "regular"} size={24} />
      </Button>

      {/* 마이페이지 */}
      <Button
        iconOnly
        size="md"
        className={location.pathname === "/mypage" ? "active" : ""}
        onClick={() => handleNav("/mypage", 4)}
        aria-label="내 정보"
      >
        <User weight={location.pathname === "/mypage" ? "fill" : "regular"} size={24} />
      </Button>
    </nav>
  );
};

export default BottomNav;
