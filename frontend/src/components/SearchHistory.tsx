import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const HistoryContainer = styled.div`
  background: #fff;
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
`;

const HistoryTitle = styled.h3`
  margin-bottom: 1rem;
  color: #2c3e50;
`;

const CityButton = styled.button`
  background: #e3f2fd;
  border: none;
  margin: 0.25rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: #1565c0;

  &:hover {
    background: #bbdefb;
  }
`;

interface SearchHistoryProps {
  onSelect: (city: string) => void;
}

export const SearchHistory: React.FC<SearchHistoryProps> = ({ onSelect }) => {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    axios.get('/api/history')
      .then(response => setHistory(response.data))
      .catch(err => console.error('Failed to fetch history', err));
  }, []);

  if (history.length === 0) return null;

  return (
    <HistoryContainer>
      <HistoryTitle>Ostatnio wyszukiwane</HistoryTitle>
      {history.map((city, index) => (
        <CityButton key={index} onClick={() => onSelect(city)}>
          {city}
        </CityButton>
      ))}
    </HistoryContainer>
  );
};
