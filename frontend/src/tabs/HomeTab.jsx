// src/pages/tabs/HomeTab.jsx
import { useState, useEffect } from "react";
import WeatherBox from "../components/WeatherBox"; 
import "../assets/HomeTab.css";

const HomeTab = () => {
  //날씨 API로 받아온 데이터 저장
  const [weather, setWeather] = useState(null);

  //미세먼지 API로 받아온 데이터 저장
  const [airData, setAirData] = useState(null);

  //.env에 저장된 API키 불러오기 
  const WEATHER_KEY = import.meta.env.VITE_WEATHER_API_KEY;
  const AIR_KEY = import.meta.env.VITE_AIRKOREA_API_KEY;

  //18시간 날씨 받아온 데이터 저장
  const [forecastData, setForecastData] = useState([]);

  //컴포넌트 마운트 시 API 호출
  useEffect(() => {
    //날씨 정보 
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=37.5665&lon=126.9780&appid=${WEATHER_KEY}&units=metric`
        );
        const data = await response.json();
        setWeather(data);
      } catch (error) {
        console.error("날씨 정보 실패:", error);
      }
    };

    //미세먼지 정보 
    const fetchAirQuality = async () => {
      const url = `https://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?serviceKey=${AIR_KEY}&returnType=json&sidoName=서울&numOfRows=100&pageNo=1`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        //측정소 리스트 중 '중구' 데이터만 찾기 
        const items = data.response.body.items;
        const target = items.find(item => item.stationName === "중구");
        
        
        if (target) {
          //예외 처리 (데이터가 - 일 때 처리)
          const parseValue = (value) =>
            value && value !== "-" ? value : "정보 없음";

          //미세먼지 등급 데이터 정리 
          setAirData({
            pm10: parseValue(target.pm10Value),
            pm25: parseValue(target.pm25Value),
            pm10Grade: target.pm10Grade,
            pm25Grade: target.pm25Grade,
          });
        } else {
          console.warn("중구 측정소 데이터를 찾을 수 없음");
        }
      } catch (error) {
        console.error("미세먼지 실패:", error);
      }
    };

    //두  API 동시 호출
    fetchWeather();
    fetchAirQuality();

    //18시간 날씨 데이터
    const fetchForecast = async () => {
      try {
        const res = await fetch (
          `https://api.openweathermap.org/data/2.5/forecast?lat=37.5665&lon=126.9780&appid=${WEATHER_KEY}&units=metric`
        );
        const data = await res.json();

        //현재 시각 이후 예보 중 6개 (18시간)
        const now = new Date();
        const upcoming = data.list
          .filter(item => new Date(item.dt_txt) > now)
          .slice(0,6);

        setForecastData(upcoming);
      } catch(err) {
        console.error("시간별 날씨 실패",err);
      }
    };

    fetchForecast();
  }, [WEATHER_KEY]);

  return (
    <div className="HomeTab">
      {/* 날씨 + 미세먼지 정보를 WeatherBox에 전달 */}
      <WeatherBox weather={weather} airData={airData} forecast={forecastData} />
      
    </div>
  );
};

export default HomeTab;
