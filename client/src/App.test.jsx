import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import App from './App.jsx';

vi.mock('./services', () => ({
  analyticsApi: { global: vi.fn(() => Promise.resolve({ data: {} })) },
  authApi: {
    login: vi.fn(),
    me: vi.fn(() => Promise.reject(new Error('Not logged in'))),
    register: vi.fn(),
  },
  cityApi: {
    activities: vi.fn(() => Promise.resolve({ data: [] })),
    details: vi.fn(),
    list: vi.fn(() => Promise.resolve({ data: [] })),
  },
  itineraryApi: {
    addActivity: vi.fn(),
    addStop: vi.fn(),
    removeActivity: vi.fn(),
    removeStop: vi.fn(),
  },
  profileApi: {
    removeSavedDestination: vi.fn(),
    saveCity: vi.fn(),
    saved: vi.fn(() => Promise.resolve({ data: [] })),
    update: vi.fn(),
  },
  tripsApi: {
    copy: vi.fn(),
    create: vi.fn(),
    list: vi.fn(() => Promise.resolve({ data: [] })),
    publicFeed: vi.fn(() => Promise.resolve({ data: [] })),
    remove: vi.fn(),
    update: vi.fn(),
  },
  getStoredUser: () => null,
  getToken: () => null,
  setStoredUser: vi.fn(),
  setToken: vi.fn(),
  removeStoredUser: vi.fn(),
  removeToken: vi.fn(),
}));

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the landing page with headline and navigation', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /explore the unseen/i })).toBeInTheDocument();
    expect(screen.getByText(/globetrotter/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^explore$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^my trips$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^builder$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^plan trip$/i })).toBeInTheDocument();
  });
});
