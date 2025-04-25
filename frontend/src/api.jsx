import axios from 'axios'

// baseURL 덕분에 api.post('/login') 이면 
// 내부적으로 http://127.0.0.1:8000/login 으로 요청을 보냄.
export const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // FastAPI 서버 주소
})

// 로그인 토큰을 헤더에 실어 보내도록 인터셉터 추가
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})