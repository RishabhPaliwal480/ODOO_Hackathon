import { request } from './api';

export const tripsApi = {
  list: () => request('/trips'),
  getById: (id) => request(`/trips/${id}`),
  create: (body) => request('/trips', { method: 'POST', body }),
  update: (id, body) => request(`/trips/${id}`, { method: 'PATCH', body }),
  remove: (id) => request(`/trips/${id}`, { method: 'DELETE' }),
  publicFeed: () => request('/trips/public/feed'),
  copy: (id) => request(`/trips/copy/${id}`, { method: 'POST' }),
  shared: (slugOrId) => request(`/trips/share/${slugOrId}`),
};
