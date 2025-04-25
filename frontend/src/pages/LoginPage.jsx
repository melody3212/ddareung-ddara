// src/pages/LoginPage.jsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  // 1) 입력 상태 관리
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();  // 2) Context의 login 함수 가져오기

  // 3) 폼 제출 시 실행되는 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault(); // 새로고침 방지
    try {
      // 4) 로그인 API 호출 (Vite 프록시를 거쳐 8000번 포트로 요청)
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ username, password }) // 폼 데이터 생성
      });

      // 5) 에러 상태 먼저 체크 (401, 422 등)
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Status ${res.status}: ${text}`);
      }

      // 6) JSON 파싱
      const data = await res.json();
      console.log("✅ 로그인 성공 응답:", data);

      // 7) Context의 login 함수 호출하여 토큰 저장 및 페이지 이동
      login(data.access_token);

    } catch (err) {
      console.error("❌ 로그인 실패:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 사용자명 입력 */}
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      {/* 비밀번호 입력 */}
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
      />
      {/* 로그인 버튼 */}
      <button type="submit">로그인</button>
    </form>
  );
}
