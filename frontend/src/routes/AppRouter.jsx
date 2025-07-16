import { Routes, Route } from "react-router-dom";
import MapPage from "../pages/MapPage";
import RecordPage from "../pages/RecordPage";
import SignupPage from "../pages/SignupPage";
import MyPage from "../pages/MyPage";
import LoginPage from '../pages/LoginPage';
//import SignupForm from "../components/SignupForm";


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
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

    </Routes>
  );
};

export default AppRouter;
