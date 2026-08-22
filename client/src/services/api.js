const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const getToken = () => localStorage.getItem('globetrotter_token');
export const setToken = (token) => localStorage.setItem('globetrotter_token', token);
export const removeToken = () => localStorage.removeItem('globetrotter_token');

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('globetrotter_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
export const setStoredUser = (user) => localStorage.setItem('globetrotter_user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('globetrotter_user');

export async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${path}`, config);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}
