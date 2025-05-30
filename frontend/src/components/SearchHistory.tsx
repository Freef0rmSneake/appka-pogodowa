import React from 'react';

interface Props {
  history: string[];
  onSearch: (city: string) => void;
}

const SearchHistory: React.FC<Props> = ({ history, onSearch }) => (
  <div>
    <h3>Historia wyszukiwań:</h3>
    <ul>
      {history.map(city => (
        <li key={city}>
          <button onClick={() => onSearch(city)}>{city}</button>
        </li>
      ))}
    </ul>
  </div>
);

export default SearchHistory;
