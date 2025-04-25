// src/pages/MyPage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function MyPage() {
  const { token, user, logout } = useAuth();
  const nav = useNavigate();

  // 1) 토큰 없으면 로그인/회원가입 화면
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
          onClick={() => nav("/login")}
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

  // 3) 로그인된 유저 화면
  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>내 정보</h1>
      {/* 프로필 사진 Placeholder */}
      <div
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "#eee",
          margin: "20px auto"
        }}
      />
      <p><strong>사용자명:</strong> {user.username}</p>
      <p><strong>이메일:</strong> {user.email}</p>
      {/* 로그아웃 버튼 */}
      <button
        style={{
          marginTop: 30,
          padding: "10px 20px",
          fontSize: 16,
          borderRadius: 6
        }}
        onClick={logout}
      >
        로그아웃
      </button>
    </div>
  );
}
