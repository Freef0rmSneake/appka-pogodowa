import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { SearchHistory } from '../SearchHistory';
import { vi } from 'vitest';
import axios from 'axios';
import userEvent from '@testing-library/user-event';

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: (url: string) => Promise<{ data: string[] }>
};

describe('SearchHistory component', () => {
  it('renders recent cities and handles clicks', async () => {
    const mockHistory = ['Warszawa', 'Kraków'];
    mockedAxios.get = vi.fn().mockResolvedValueOnce({ data: mockHistory });

    const handleSelect = vi.fn();
    const user = userEvent.setup();

    render(<SearchHistory onSelect={handleSelect} />);

    await waitFor(() => {
      expect(screen.getByText('Warszawa')).toBeInTheDocument();
      expect(screen.getByText('Kraków')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Kraków'));

    expect(handleSelect).toHaveBeenCalledWith('Kraków');
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
