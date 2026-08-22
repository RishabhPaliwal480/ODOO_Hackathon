import { request } from './api';

export const profileApi = {
  update: (body) => request('/profile', { method: 'PATCH', body }),
  saved: () => request('/profile/saved-destinations'),
  saveCity: (cityId) => request(`/profile/saved-destinations/${cityId}`, { method: 'POST' }),
  removeSavedDestination: (cityId) => request(`/profile/saved-destinations/${cityId}`, { method: 'DELETE' }),
};
