import React, { useState } from 'react';
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";
import axios from 'axios';
import './index.css'; // Import the custom CSS file

const API_KEY = '34b68b5c901b8b78c47eb77a9146421a';

function WeatherDashboard() {
  const [city, setCity] = useState('');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [onDarkMode,setDarkMode]=useState(false)

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    setCurrentWeather(null);
    setForecast([]);

    try {
      // Fetch current weather
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setCurrentWeather(weatherResponse.data);
      console.log(weatherResponse)
      // Fetch 5-day forecast
      const forecastResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      const forecastData = forecastResponse.data.list.filter((reading) =>
        reading.dt_txt.includes('12:00:00')
      );
      setForecast(forecastData);

      setLoading(false);
    } catch (err) {
      setError('City not found or API request failed');
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchWeatherData();
  };

  const onClickTheme=()=>{
    setDarkMode((previousState=>!previousState))
  }

  const btnText=onDarkMode?<CiDark className='dark-icon'/>:<CiLight className='light-icon'/>

  const themeColor=onDarkMode?'theme-dark':'theme-light'
  const textColor=onDarkMode? 'text-light-theme':'text-dark-theme'
  const shadowColor=onDarkMode?'card-dark':'card'
  return (
    <div className={`container mt-5 ${themeColor}`}>
      <div className='header-container'>
         <h1 className={`text-center mb-4 ${textColor}`}>Weather Dashboard</h1>
         <button className='theme-button' onClick={onClickTheme}>{btnText}</button>
      </div>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="search-bar">
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit">Search</button>
        </div>
      </form>
      {/* Loading and Error Messages */}
      {loading && <p className={`text-center ${textColor}`}>Loading...</p>}
      {error && <p className={`text-danger text-center ${textColor}`}>{error}</p>}
      {/* Current Weather */}
      {currentWeather && (
        <div className={`card mb-4 ${shadowColor}`}>
          <div className="card-body">
            <h2 className={`card-title ${textColor}`}>Current Weather in {currentWeather.name}</h2>
            <p className={`card-title ${textColor}`}>Temperature: {currentWeather.main.temp} °C</p>
            <p className={`card-title ${textColor}`}>
              <strong>Description: </strong>{currentWeather.weather[0].description}
            </p>
            <p className={`card-title ${textColor}`}>
              <strong>Wind Speed: </strong>{currentWeather.wind.speed} m/s
            </p>
            <p className={`card-title ${textColor}`}>
              <strong>Humidity: </strong>{currentWeather.main.humidity} %
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
          </div>
        </div>
      )}

      {/* 5-Day Forecast */}
      {forecast.length > 0 && (
        <div>
          <h2 className={`text-center mb-4 ${textColor}`}>5-Day Forecast</h2>
          <div className="forecast-row">
            {forecast.map((day, index) => (
              <div key={index} className="forecast-col">
                <div className={`${shadowColor}`}>
                  <div className="card-body">
                    <p className={`card-text ${textColor}`}>
                      {new Date(day.dt_txt).toLocaleDateString()}
                    </p>
                    <p className={`card-text ${textColor}`}>Temp: {day.main.temp} °C</p>
                    <p className={`card-text ${textColor}`}>{day.weather[0].description}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                      alt="weather icon"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherDashboard;

