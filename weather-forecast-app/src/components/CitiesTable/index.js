import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import { fetchCities } from '../../api';
import { Bars } from 'react-loader-spinner';
import './index.css';

const getSuggestions = (value, cities) => {
  const inputValue = value.trim().toLowerCase();
  return cities.filter(city => city.name.toLowerCase().includes(inputValue));
};

const renderSuggestion = suggestion => (
  <div>{suggestion.name}</div>
);

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      try {
        const data = await fetchCities(offset, 20, query);
        console.log('Fetched data:', data);

        if (Array.isArray(data)) {
          setCities(prev => [...prev, ...data]);
          setHasMore(data.length > 0);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, [offset, query]);

  useEffect(() => {
    setSuggestions(getSuggestions(query, cities));
  }, [query, cities]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight - 50 && !loading && hasMore) {
        setOffset(prev => prev + 20);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, cities));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onSuggestionSelected = (event, { suggestion }) => {
    setQuery(suggestion.name);
  };

  const inputProps = {
    placeholder: 'Search cities...',
    value: query,
    onChange: (event, { newValue }) => setQuery(newValue)
  };

  return (
    <div className="cities-table">
      <h1 className='heading'>Weather Forecast Application</h1>
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={suggestion => suggestion.name}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
      />
      <table>
        <thead>
          <tr>
            <th className='table-header'>City</th>
            <th className='table-header'>Country</th>
            <th className='table-header'>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cities.length === 0 ? (
            <tr>
              <div className='no-data-container'>
                <img className='no-data' src='https://res.cloudinary.com/dyhrvktyr/image/upload/v1725627054/no_data_image_bwoxu4.avif' alt='no data' />
              </div>
            </tr>
          ) : (
            cities.map(city => (
              <tr key={city.geoname_id}> 
                <td className='table-data'>
                  <Link to={`/weather/${city.name}`} target="_blank">{city.name}</Link>
                </td>
                <td className='table-data'>{city.cou_name_en}</td>
                <td className='table-data'>{city.timezone}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {loading && <div className="spinner-container">
          <Bars color="#00BFFF" height={50} width={50} />
        </div>}
    </div>
  );
};

export default CitiesTable;
