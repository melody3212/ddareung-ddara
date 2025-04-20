import { Routes, Route } from "react-router-dom";
import MapPage from "../pages/MapPage";
import RecordPage from "../pages/RecordPage";
import MyPage from "../pages/MyPage";

const AppRouter = ({ currentIndex, setCurrentIndex }) => {
  return (
    <Routes>
      <Route path="/" 
        element={
          <MapPage
            currentIndex={currentIndex}
            setCurrentIndex={setCurrentIndex}
          />
        }
      />
      <Route path="/record" element={<RecordPage />} />
      <Route path="/mypage" element={<MyPage />} />
    </Routes>
  );
};

export default AppRouter;
