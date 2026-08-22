import { request } from './api';

export const cityApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request(`/cities${query ? `?${query}` : ''}`);
  },
  details: (id) => request(`/cities/${id}`),
  activities: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ''))
    ).toString();
    return request(`/cities/activities/search${query ? `?${query}` : ''}`);
  },
};
