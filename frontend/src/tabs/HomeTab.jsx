// src/pages/tabs/HomeTab.jsx
import { useState, useEffect } from 'react';
import WeatherBox from '../components/WeatherBox';
import { fetchCurrentWeather, fetchForecast, fetchAirQuality } from '../api/weatherapi';
import '../assets/HomeTab.css';

const HomeTab = () => {
  const [weather,  setWeather]  = useState(null);
  const [forecast, setForecast] = useState([]);
  const [airData,  setAirData]  = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [w, f, a] = await Promise.all([
          fetchCurrentWeather(),
          fetchForecast(),
          fetchAirQuality()
        ]);
        setWeather(w);
        setForecast(f);
        setAirData(a);
      } catch (err) {
        console.error('API 호출 에러:', err);
      }
    })();
  }, []);

  return (
    <div className="HomeTab">
      <WeatherBox
        weather={weather}
        forecast={forecast}
        airData={airData}
      />
    </div>
  );
};

export default HomeTab;





