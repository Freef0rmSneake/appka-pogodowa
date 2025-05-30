import React from 'react';

interface CityListProps {
  cities: string[];
  onSelect: (city: string) => void;
}

const CityList: React.FC<CityListProps> = ({ cities, onSelect }) => (
  <ul>
    {cities.map(city => (
      <li key={city}>
        <button onClick={() => onSelect(city)}>{city}</button>
      </li>
    ))}
  </ul>
);

export default CityList;
