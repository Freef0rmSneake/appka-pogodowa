import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FiSearch, FiLoader, FiMapPin, FiClock } from 'react-icons/fi';
import { getCities } from '../services/weatherService';

interface SearchBarProps {
  city: string;
  setCity: (city: string) => void;
  onSearch: (city: string) => void;
  loading: boolean;
  searchHistory: string[];
}

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 50px;
  outline: none;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:focus {
    border-color: #4a90e2;
    box-shadow: 0 4px 12px rgba(74, 144, 226, 0.2);
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #757575;
`;

const LoadingIcon = styled(FiLoader)`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4a90e2;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: translateY(-50%) rotate(0deg); }
    100% { transform: translateY(-50%) rotate(360deg); }
  }
`;

const SuggestionsList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-top: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 10;
  padding: 0;
  list-style: none;
`;

const SuggestionItem = styled.li`
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const SuggestionText = styled.span`
  flex: 1;
  text-align: left;
`;

const HighlightedText = styled.span`
  font-weight: 600;
  color: #1976d2;
`;

const SuggestionCountry = styled.span`
  background-color: #e3f2fd;
  color: #1976d2;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  margin-left: 0.5rem;
`;

export const SearchBar: React.FC<SearchBarProps> = ({ city, setCity, onSearch, loading, searchHistory }) => {
  const [allCities, setAllCities] = useState<Array<{ name: string; country: string }>>([]);
  const [filteredCities, setFilteredCities] = useState<Array<{ name: string; country: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load Polish cities on component mount
  useEffect(() => {
    const loadCities = async () => {
      try {
        console.log('Loading cities...');
        const cities = await getCities();
        console.log('Cities loaded:', cities);
        
        if (!Array.isArray(cities)) {
          console.error('Unexpected cities format:', cities);
          return;
        }
        
        const formattedCities = cities.map(cityName => ({
          name: cityName,
          country: 'PL',
        }));
        
        console.log('Formatted cities:', formattedCities);
        setAllCities(formattedCities);
      } catch (error) {
        console.error('Error loading cities:', error);
      }
    };

    loadCities();
  }, []);

  // Filter cities based on input
  useEffect(() => {
    if (city.trim().length > 0) {
      const searchTerm = city.toLowerCase();
      const filtered = allCities.filter(city => 
        city.name.toLowerCase().includes(searchTerm)
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(allCities);
    }
  }, [city, allCities]);

  // Pokazuj listę miast zawsze po kliknięciu w pole
  useEffect(() => {
    if (showSuggestions && filteredCities.length === 0 && allCities.length > 0) {
      setFilteredCities(allCities);
    }
  }, [showSuggestions, allCities, filteredCities.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
    if (city.trim() === '' && searchHistory.length > 0) {
      setShowHistory(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
      setShowHistory(false);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    setShowHistory(false);
  };

  const handleHistoryClick = (historyCity: string) => {
    setCity(historyCity);
    onSearch(historyCity);
    setShowHistory(false);
    setShowSuggestions(false);
  };

  return (
    <SearchContainer>
      <form onSubmit={handleSubmit} autoComplete="off">
        <SearchContainer>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="Wyszukaj miasto..."
            value={city}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            disabled={loading}
          />
          {loading && <LoadingIcon />}

          {/* Najpierw historia (filtrowana), potem separator, potem podpowiedzi miast (filtrowane) */}
          {showSuggestions && (searchHistory.length > 0 || filteredCities.length > 0) && (
            <SuggestionsList>
              {/* Historia */}
              {searchHistory.filter(h => h.toLowerCase().includes(city.toLowerCase())).slice(0, 10).map((h: string, idx: number) => (
                <SuggestionItem key={h+idx} onClick={() => handleHistoryClick(h)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                  <FiClock style={{ marginRight: 8 }} />
                  <span style={{ textAlign: 'left' }}>{h}</span>
                </SuggestionItem>
              ))}
              {/* Separator jeśli jest i historia, i miasta */}
              {searchHistory.filter(h => h.toLowerCase().includes(city.toLowerCase())).length > 0 && filteredCities.filter(cityObj => cityObj.name.toLowerCase().includes(city.toLowerCase())).length > 0 && (
                <div style={{ borderTop: '1px solid #eee', margin: '2px 0 2px 0' }} />
              )}
              {/* Podpowiedzi miast */}
              {filteredCities.filter(cityObj => cityObj.name.toLowerCase().includes(city.toLowerCase())).slice(0, 10).map((suggestion, index) => {
                const match = suggestion.name.toLowerCase().indexOf(city.toLowerCase());
                if (match !== -1 && city.trim()) {
                  const beforeMatch = suggestion.name.slice(0, match);
                  const afterMatch = suggestion.name.slice(match + city.length);
                  return (
                    <SuggestionItem
                      key={`${suggestion.name}-${index}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                    >
                      <FiMapPin style={{ marginRight: 8 }} />
                      <SuggestionText>
                        {beforeMatch}
                        <HighlightedText>{suggestion.name.slice(match, match + city.length)}</HighlightedText>
                        {afterMatch}
                      </SuggestionText>
                      <SuggestionCountry>{suggestion.country}</SuggestionCountry>
                    </SuggestionItem>
                  );
                } else {
                  return (
                    <SuggestionItem
                      key={`${suggestion.name}-${index}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSuggestionClick(suggestion.name)}
                    >
                      <FiMapPin style={{ marginRight: 8 }} />
                      <SuggestionText>{suggestion.name}</SuggestionText>
                      <SuggestionCountry>{suggestion.country}</SuggestionCountry>
                    </SuggestionItem>
                  );
                }
              })}
            </SuggestionsList>
          )}
        </SearchContainer>
      </form>
    </SearchContainer>
  );
};
