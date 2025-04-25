// frontend/src/components/SignupForm.jsx

import React, { useState } from 'react'
import { api } from '../api'               // axios 인스턴스
import { useNavigate } from 'react-router-dom'

export default function SignupForm() {
  // 입력값
  const [username, setUsername] = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')

  // 필드별 에러 메시지
  const [userError, setUserError]     = useState('')
  const [emailError, setEmailError]   = useState('')
  const [pwError, setPwError]         = useState('')
  const [submitError, setSubmitError] = useState('')

  const navigate = useNavigate()

  // 유효성 체크 함수들
  const validateUsername = (name) => {
    if (name.length < 6) return '아이디는 최소 6자 이상이어야 합니다.'
    return ''
  }
  const validateEmail = (mail) => {
    // 간단한 이메일 패턴
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!re.test(mail)) return '유효한 이메일 주소가 아닙니다.'
    return ''
  }
  const validatePassword = (pw) => {
    if (pw.length < 6) return '비밀번호는 최소 6자 이상이어야 합니다.'
    return ''
  }

  // onChange마다 실시간 검증
  const onUserChange = (e) => {
    const v = e.target.value
    setUsername(v)
    setUserError(validateUsername(v))
  }
  const onEmailChange = (e) => {
    const v = e.target.value
    setEmail(v)
    setEmailError(validateEmail(v))
  }
  const onPwChange = (e) => {
    const v = e.target.value
    setPassword(v)
    setPwError(validatePassword(v))
  }

  const handleSignup = async () => {
    // 제출 전에 다시 한 번 검사
    const ue = validateUsername(username)
    const ee = validateEmail(email)
    const pe = validatePassword(password)
    setUserError(ue)
    setEmailError(ee)
    setPwError(pe)
    if (ue || ee || pe) {
      setSubmitError('입력값을 다시 확인하세요.')
      return
    }

    try {
      // API 호출
      await api.post('/signup', { username, email, password })
      navigate('/login')
    } catch (e) {
      // 서버 에러 메시지
      setSubmitError(e.response?.data?.detail || '서버 에러로 회원가입 실패')
    }
  }

  return (
    <div>
      <h2>회원가입</h2>

      <div>
        {/* 입력 폼 */}
        <input
          placeholder="아이디 (6자 이상)" 
          value={username}
          onChange={onUserChange}
        />
        {userError && <p style={{color:'red'}} > {userError}</p>}
      </div>

      <div>
        <input
          placeholder="이메일"
          value={email}
          onChange={onEmailChange}
        />
        {emailError && <p style={{ color:'red'}}> {emailError}</p>}
      </div>

      <div>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={onPwChange}
        />
        {pwError && <p style={{ color:'red'}}> {pwError}</p>}
      </div>

      {/* 가입하기 버튼 */}
      <button onClick={handleSignup}>가입하기</button>

      {/* 에러 메시지 */}
      {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
    </div>
  )
}
