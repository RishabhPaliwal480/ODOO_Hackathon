import { request } from './api';

export const itineraryApi = {
  addStop: (body) => request('/itinerary/stops', { method: 'POST', body }),
  removeStop: (id) => request(`/itinerary/stops/${id}`, { method: 'DELETE' }),
  addActivity: (body) => request('/itinerary/activities', { method: 'POST', body }),
  removeActivity: (id) => request(`/itinerary/activities/${id}`, { method: 'DELETE' }),
};
