import React, { useState } from 'react'
import { api } from '../api'               // axios 인스턴스
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  // 1) 입력 상태 관리
  const [username, setUsername] = useState('')  // 아이디
  const [password, setPassword] = useState('')  // 비밀번호
  const [error,    setError]    = useState('')  // 에러 메시지

  const navigate = useNavigate()               // 페이지 이동 훅

  // 2) 로그인 처리 함수
  const handleLogin = async () => {
    console.log("🔔 로그인 요청 payload:", { username, password })
    setError('')  // 이전 에러 초기화

    try {
      // POST /login 으로 인증 정보 전송
      const res = await api.post('/login', { username, password })

      // JWT 토큰을 로컬 스토리지에 저장
      localStorage.setItem('token', res.data.access_token)

      // 로그인 성공 후 메인 페이지로 이동
      navigate('/')
    } catch (e) {
      // 인증 실패 시 에러 표시
      setError('로그인 실패: 아이디 또는 비밀번호를 확인하세요.',e)
    }
  }

  return (
    <div>
      <h2>로그인</h2>

      {/* 입력 폼 */}
      <input
        placeholder="아이디"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      {/* 로그인 버튼 */}
      <button onClick={handleLogin}>로그인</button>

      {/* 에러 메시지 */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
