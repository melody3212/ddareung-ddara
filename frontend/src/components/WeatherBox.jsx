// src/components/WeatherBox.jsx
import "../assets/WeatherBox.css";
import HourlyWeather from "./HourlyWeather";

const WeatherBox = ({ weather, airData, forecast }) => {
    if (!weather || !airData) return <p>날씨 불러오는 중...</p>;

    // 현재 시각
    const hour = new Date().getHours();
    const isNight = hour >= 21 || hour <= 4;

    // 날씨 상태 이모지 및 한글 설명 매핑
    const weatherEmoji = {
        Clear: { icon: isNight ? "🌙" : "☀️", text: "맑음" },
        Clouds: { icon: "☁️", text: "흐림" },
        Rain: { icon: "☔", text: "비" },
        Snow: { icon: "❄️", text: "눈" },
        Drizzle: { icon: "☂️", text: "이슬비" },
        Thunderstorm: { icon: "⛈️", text: "뇌우" },
        default: { icon: isNight ? "🌙" : "🌤️", text: "맑음" },
    };

    const mainWeather = weather.weather[0].main;
    const matched = weatherEmoji[mainWeather] || weatherEmoji.default;
    const emoji = matched.icon;
    const desc = matched.text;


    // 미세먼지 등급 코드 → 텍스트 변환
    const gradeToText = (grade) => {
        switch (grade) {
        case "1": return "좋음";
        case "2": return "보통";
        case "3": return "나쁨";
        case "4": return "매우 나쁨";
        default: return "정보 없음";
        }
    };

    return (
        <div className="WeatherBox">
        <p className="WeatherBox_location">{weather.name} </p>

        <div className="WeatherBox_main">

            {/* 왼쪽: 날씨 아이콘 및 현재온도 */}
            <div className="WeatherBox_left">
                <div className="WeatherBox_it">
                    <div className="WeatherBox_emoji">{emoji}</div>
                    <p className="WeatherBox_temp">{Math.round(weather.main.temp)}°</p>
                </div>
                <p className="WeatherBox_desc">{desc}</p>
            </div>
            
            {/* 오른쪽: 체감온도, 미세먼지 */}
            <div className="WeatherBox_right">
                <p>체감온도: {weather.main.feels_like}°</p>
                <p>미세: {gradeToText(airData.pm10Grade)}</p>
                <p>초미세: {gradeToText(airData.pm25Grade)}</p>
            </div>

        
        </div>

        {/* 시간대별 날씨 */}
        <div className="WeatherBox_hourly">
            <HourlyWeather forecast={forecast} />
        </div>
        </div>
    );
};

export default WeatherBox;
