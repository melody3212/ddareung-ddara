//frontend/src/pages/SignupPage.jsx
import React, { useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import '../assets/SignupPage.css'

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')

  const [userError, setUserError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [pwError, setPwError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)

  const navigate = useNavigate()
  const { login: doLogin } = useAuth()

  const validateUsername = (v) => v.length < 6 ? '아이디는 최소 6자 이상입니다.' : ''
  const validateEmail = (v) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return !re.test(v) ? '유효한 이메일이 아닙니다.' : ''
  }
  const validatePassword = (v) => v.length < 6 ? '비밀번호는 최소 6자 이상입니다.' : ''

  const onUserChange = (e) => { setUsername(e.target.value); setUserError(validateUsername(e.target.value)) }
  const onEmailChange = (e) => { setEmail(e.target.value); setEmailError(validateEmail(e.target.value)) }
  const onPwChange = (e) => { setPassword(e.target.value); setPwError(validatePassword(e.target.value)) }
  const onCodeChange = (e) => setCode(e.target.value)

  const sendCode = async () => {
    try {
      await api.post('/auth/send-code', { email })
      setCodeSent(true)
      setSubmitError('')
    } catch {
      setSubmitError('인증 코드 전송 실패')
    }
  }
  const verifyCode = async () => {
    try {
      await api.post('/auth/verify-code', { email, code })
      setVerified(true)
      setSubmitError('')
    } catch {
      setSubmitError('인증 실패')
    }
  }

  const handleSignup = async () => {
    const ue = validateUsername(username)
    const ee = validateEmail(email)
    const pe = validatePassword(password)
    setUserError(ue); setEmailError(ee); setPwError(pe)
    if (ue || ee || pe) { setSubmitError('입력값을 확인하세요.'); return }
    if (!verified) { setSubmitError('이메일 인증 필요'); return }
    try {
      await api.post('/signup', { username, email, password })
      navigate('/')
    } catch (e) {
      setSubmitError(e.response?.data?.detail || '회원가입 실패')
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setSubmitError('')
    try {
      const res = await api.post('/login', { username, password })
      doLogin(res.data.access_token)
    } catch (e) {
      setSubmitError(e.response?.data?.detail || '로그인 실패')
    }
  }

  return (
    
    <div className="signup-page-container">
      <div style={{ textAlign: "center", marginTop: 60 ,marginBottom: 25}}>
        <h2>🎉 회원 전용 서비스입니다</h2>
      </div>
      <div className="toggle-buttons">
        {/* 버튼 순서 변경: 로그인 먼저, 회원가입 나중 */}
        <button
          onClick={() => { setIsLogin(true); setSubmitError('') }}
          className={isLogin ? 'active' : ''}
        >로그인</button>
        <button
          onClick={() => { setIsLogin(false); setSubmitError('') }}
          className={!isLogin ? 'active' : ''}
        >회원가입</button>
      </div>

      {isLogin ? (
        <form className="login-form" onSubmit={handleLogin}>
          <input placeholder="아이디" value={username} onChange={onUserChange} />
          {userError && <p className="error">{userError}</p>}

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={onPwChange}
          />
          {pwError && <p className="error">{pwError}</p>}

          <button type="submit">로그인</button>
          {submitError && <p className="error submit-error">{submitError}</p>}
        </form>
      ) : (
        <div className="join-form">
          <input
            placeholder="아이디 (6자 이상)"
            value={username}
            onChange={onUserChange}
          />
          {userError && <p className="error">{userError}</p>}

          <input placeholder="이메일" value={email} onChange={onEmailChange} />
          {emailError && <p className="error">{emailError}</p>}

          <div className="email-code">
            <button
              type="button"
              onClick={sendCode}
              disabled={codeSent || !!emailError}
            >코드 전송</button>

            {codeSent && (
              <>
                <input
                  placeholder="인증 코드"
                  value={code}
                  onChange={onCodeChange}
                />
                <button
                  type="button"
                  onClick={verifyCode}
                  disabled={verified}
                >인증 확인</button>
              </>
            )}
          </div>

          <input
            type="password"
            placeholder="비밀번호 (6자 이상)"
            value={password}
            onChange={onPwChange}
          />
          {pwError && <p className="error">{pwError}</p>}

          <button onClick={handleSignup}>가입하기</button>
          {submitError && <p className="error submit-error">{submitError}</p>}
        </div>
      )}
    </div>
  )
}