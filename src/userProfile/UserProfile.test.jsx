/* eslint-disable testing-library/no-unnecessary-act */
import React from 'react';
import { render, screen } from '@testing-library/react';
import UserProfile from './UserProfile';
import { act } from 'react';

// Mock fetch globally
global.fetch = jest.fn();

describe('UserProfile Component', () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  test('displays loading message when data is being fetched', async () => {
    fetch.mockImplementationOnce(() =>
      new Promise((resolve) =>
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ name: 'John Doe', email: 'john.doe@example.com' }),
        }), 100) // Simulating network delay
      )
    );

    await act(async () => {
      render(<UserProfile userId={1} />);
    })

    // Check if the loading message is rendered initially
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test('displays user data when the fetch is successful', async () => {
    const mockUserData = { name: 'John Doe', email: 'john.doe@example.com' };
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUserData
    });

    await act(async () => {
      render(<UserProfile userId={1} />);
    })

    // Use findByText to automatically wait for the element to appear
    const nameElement = await screen.findByText(mockUserData.name);
    expect(nameElement).toBeInTheDocument();
    expect(screen.getByText(`Email: ${mockUserData.email}`)).toBeInTheDocument();
  });

  test('displays an error message when fetch fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Failed to fetch user data'));

    await act(async () => {
      render(<UserProfile userId={1} />);
    })

    // Use findByText to automatically wait for the error message
    const errorMessage = await screen.findByText(/Error: Failed to fetch user data/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
