// src/pages/MyPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import MyPageHeader from "../components/MyPageHeader";

export default function MyPage() {
  const { token, user} = useAuth();
  const nav = useNavigate();

  // 1) 토큰 없으면 로그인/회원가입 화면 (기존과 동일)
  if (!token) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>🎉 회원 전용 서비스입니다</h2>
        <button
          style={{
            display: "block",
            width: 200,
            padding: 15,
            margin: "20px auto",
            fontSize: 18,
            borderRadius: 8
          }}
          onClick={() => nav("/signup")}
        >
          로그인하기
        </button>
        <button
          style={{
            display: "block",
            width: 200,
            padding: 15,
            margin: "0 auto",
            fontSize: 18,
            borderRadius: 8
          }}
          onClick={() => nav("/signup")}
        >
          회원가입하기
        </button>
      </div>
    );
  }

  // 2) 사용자 정보 로딩 중
  if (!user) {
    return <div style={{ textAlign: "center", marginTop: 100 }}>로딩 중...</div>;
  }

  // 3) 로그인된 유저 화면 (헤더 컴포넌트 적용)
  const handleEditProfile = () => {
    // 프로필 수정 페이지 또는 모달로 이동/오픈 로직
    nav("/mypage/edit");
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto" }}>
      {/* 상단 프로필 헤더 */}
      <MyPageHeader user={user} onEdit={handleEditProfile} />

      {/* 내 정보, 로그아웃 버튼 */}
      <div style={{ textAlign: "center", padding: "20px 0" }}>
        

      </div>
    </div>
  );
}
