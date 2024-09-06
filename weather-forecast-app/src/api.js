
const BASE_URL = 'https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?';

export const fetchCities = async (offset = 0, limit = 20, query = '') => {
  try {
    const url = `${BASE_URL}start=${offset}&limit=${limit}&disjunctive.cou_name_en&q=${encodeURIComponent(query)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched cities data:', data);
    return data.results || []; 
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
};

  

export const fetchWeather = async (city) => {
  if (!city) {
    throw new Error('City parameter is required');
  }

  const apiKey = 'b7f27977458adb50d6075c0c6bcc3cd1';
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  console.log('Fetching weather data from:', url); 

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};



