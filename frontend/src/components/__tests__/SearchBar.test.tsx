import React, { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SearchBar } from '../SearchBar';
import { vi } from 'vitest';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: (url: string) => Promise<{ data: string[] }>
};


const RenderWithState = ({ onSearch }: { onSearch: (city: string) => void }) => {
  const [city, setCity] = useState('');
  return <SearchBar city={city} setCity={setCity} onSearch={onSearch} loading={false} />;
};

describe('SearchBar component', () => {
  it('calls onSearch when city is submitted', async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: ['Warszawa', 'Kraków']
    });

    const onSearch = vi.fn();
    const user = userEvent.setup();

    render(<RenderWithState onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(/wpisz nazwę miasta/i);
    await user.type(input, 'Kraków{enter}');

    await waitFor(() => {
      expect(onSearch).toHaveBeenCalledWith('Kraków');
    });
  });

  it('displays suggestions and handles click', async () => {
    mockedAxios.get = vi.fn().mockResolvedValueOnce({
      data: ['Warszawa', 'Kraków', 'Wrocław']
    });
  
    const onSearch = vi.fn();
    const user = userEvent.setup();
  
    render(<RenderWithState onSearch={onSearch} />);
  
    const input = screen.getByPlaceholderText(/wpisz nazwę miasta/i);
    await user.type(input, 'Krak');
  
    const listItems = await screen.findAllByRole('listitem');
    const krakowItem = listItems.find(item => item.textContent?.includes('Kraków'));
    expect(krakowItem).toBeTruthy();
  
    await user.click(krakowItem!);
  
    expect(onSearch).toHaveBeenCalledWith('Kraków');
  });  
});
