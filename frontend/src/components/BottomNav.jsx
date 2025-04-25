import { useNavigate, useLocation } from "react-router-dom";
import { House, BookmarkSimple, MapTrifold, ClipboardText, User } from "phosphor-react";
// Button 컴포넌트 경로는 너 프로젝트 구조에 맞춰 수정!
import Button from "../components/Button"; 
import "../assets/BottomNav.css";

const BottomNav = ({ setCurrentIndex, currentIndex }) => {
  const nav = useNavigate();
  const location = useLocation();

  const goSlideTab = (index) => {
    setCurrentIndex(index);
    if (location.pathname !== "/") {
      nav("/");
    }
  };

  return (
    <nav className="BottomNav">
      <Button
        iconOnly
        size="md"
        className={currentIndex === 0 ? "active" : ""}
        onClick={() => goSlideTab(0)}
        aria-label="홈"
      >
        <House weight={currentIndex === 0 ? "fill" : "regular"} size={24} />
      </Button>

      <Button
        iconOnly
        size="md"
        className={currentIndex === 1 ? "active" : ""}
        onClick={() => goSlideTab(1)}
        aria-label="저장"
      >
        <BookmarkSimple weight={currentIndex === 1 ? "fill" : "regular"} size={24} />
      </Button>

      <Button
        iconOnly
        size="md"
        className={currentIndex === 2 ? "active" : ""}
        onClick={() => goSlideTab(2)}
        aria-label="코스"
      >
        <MapTrifold weight={currentIndex === 2 ? "fill" : "regular"} size={24} />
      </Button>

      <Button
        iconOnly
        size="md"
        className={location.pathname === "/record" ? "active" : ""}
        onClick={() => nav("/record")}
        aria-label="기록"
      >
        <ClipboardText size={24} />
      </Button>

      <Button
        iconOnly
        size="md"
        className={location.pathname === "/mypage" ? "active" : ""}
        onClick={() => nav("/mypage")}
        aria-label="내 정보"
      >
        <User size={24} />
      </Button>
    </nav>
  );
};

export default BottomNav;
