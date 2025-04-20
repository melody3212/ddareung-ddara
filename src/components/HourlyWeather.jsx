// src/components/HourlyWeather.jsx
import "../assets/HourlyWeather.css";

const HourlyWeather = ({ forecast }) => {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="HourlyWeather">
      {forecast.map((item, index) => {
        const date = new Date(item.dt_txt);
        const hour = date.getHours();
        const isNight = hour >= 21 || hour <= 4;

        // 날씨 상태
        const weather = item.weather[0].main;

        // 날씨 상태에 따른 이모지 + 한글 설명
        const weatherMap = {
          Clear: { icon: isNight ? "🌙" : "☀️", text: "맑음" },
          Clouds: { icon: "☁️", text: "흐림" },
          Rain: { icon: "☔", text: "비" },
          Snow: { icon: "❄️", text: "눈" },
          Drizzle: { icon: "☂️", text: "이슬비" },
          Thunderstorm: { icon: "⛈️", text: "뇌우" },
          default: { icon: isNight ? "🌙" : "🌤️", text: "맑음" },
        };

        const matched = weatherMap[weather] || weatherMap.default;
        const temp = Math.round(item.main.temp);
       // const pop = Math.round(item.pop * 100); // 강수확률 %

        return (
          <div className="HourlyWeather__item" key={index}>
            <p className="HourlyWeather__hour">{hour}시</p>
            <div className="HourlyWeather__emoji">{matched.icon}</div>
            <p className="HourlyWeather__temp">{temp}°C</p>
            {/*<p className="HourlyWeather__pop">{pop}%</p>*/}
          </div>
        );
      })}
    </div>
  );
};

export default HourlyWeather;
