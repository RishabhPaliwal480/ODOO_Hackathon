import { request } from './api';

export const analyticsApi = {
  global: () => request('/analytics'),
};
