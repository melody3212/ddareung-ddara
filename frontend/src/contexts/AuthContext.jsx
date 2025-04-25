import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // 앱 시작 시 토큰 로드
  useEffect(() => {
    const t = localStorage.getItem("access_token");
    if (t) setToken(t);
  }, []);

  // 토큰 변경 시 사용자 정보 조회
  useEffect(() => {
    console.log("🛠️ AuthContext token:", token);
    if (!token) return setUser(null);

    console.log("🛠️ Fetching /api/me with header:", `Bearer ${token}`);
    fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then(data => setUser(data))
      .catch(() => {
        setToken(null);
        localStorage.removeItem("access_token");
        navigate("/login");
      });
  }, [token, navigate]);

  // 로그인 함수
  const login = (newToken) => {
    localStorage.setItem("access_token", newToken);
    setToken(newToken);
    navigate("/mypage");
  };

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
