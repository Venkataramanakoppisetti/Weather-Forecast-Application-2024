import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchWeather } from '../../api';
import BackButton from '../../components/BackButton';
import { Bars } from 'react-loader-spinner'; 
import './index.css';

const WeatherPage = () => {
  const { city } = useParams(); 
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadWeather = async () => {
      try {
        if (!city) {
          throw new Error('City name is missing');
        }

        setLoading(true);
        const data = await fetchWeather(city); 
        console.log('Fetched weather data:', data);
        setWeather(data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to load weather data.');
      } finally {
        setLoading(false);
      }
    };

    loadWeather();
  }, [city]);

  if (loading) 
    return (
      <div className="spinner-container m=50">
        <Bars color="#00BFFF" height={80} width={80} />
      </div>
    );
  if (error) 
    return <p>{error}</p>;
  if (!weather) 
    return <p>No weather data available.</p>;

  return (
    <div className="weather-page">
      <h1 className='city-weather'>City Weather</h1>
      <div className='weather-condition'>
        <h2 className='condition-in-city'>Weather in {weather.name}</h2>
        <div className="weather-info">
          <p className='condition'>Temperature: {weather.main.temp}°C</p>
          <p className='condition'>Weather: {weather.weather[0].description}</p>
          <p className='condition'>Humidity: {weather.main.humidity}%</p>
          <p className='condition'>Wind Speed: {weather.wind.speed} m/s</p>
          <p className='condition'>Pressure: {weather.main.pressure} hPa</p>
        </div>
        <BackButton onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default WeatherPage;
