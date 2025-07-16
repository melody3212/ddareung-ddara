// src/api/weatherapi.jsx

// 환경변수
const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const AIR_KEY     = import.meta.env.VITE_AIRKOREA_API_KEY;

const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5';
const BASE_AIR_URL     = 'https://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

// 현재 날씨 조회
export async function fetchCurrentWeather(lat = 37.5665, lon = 126.9780) {
  const url = `${BASE_WEATHER_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`);
  return res.json();
}

// 18시간 예보 (디폴트 6개)
export async function fetchForecast(lat = 37.5665, lon = 126.9780, count = 6) {
  const url = `${BASE_WEATHER_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_KEY}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Forecast API error: ${res.status}`);
  const data = await res.json();

  const now = new Date();
  return data.list
    .filter(item => new Date(item.dt_txt) > now)
    .slice(0, count);
}

// 미세먼지 실시간(기본: 서울 중구)
export async function fetchAirQuality(siDo = '서울', station = '중구') {
  const url = `${BASE_AIR_URL}/getCtprvnRltmMesureDnsty?serviceKey=${AIR_KEY}&returnType=json&sidoName=${siDo}&numOfRows=100&pageNo=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Air API error: ${res.status}`);
  const json = await res.json();
  const items = json.response.body.items;
  const target = items.find(i => i.stationName === station);
  if (!target) return null;

  const parseValue = v => (v && v !== '-' ? v : '정보 없음');
  return {
    pm10:      parseValue(target.pm10Value),
    pm25:      parseValue(target.pm25Value),
    pm10Grade: target.pm10Grade,
    pm25Grade: target.pm25Grade,
  };
}