/*** Axios client - base URL from env, bearer auto-attach, 401 -> /settings ***/
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAppStore } from '../store';

const baseURL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  timeout: 30_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAppStore.getState().brainUiToken;
  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

api.interceptors.response.use(
  (resp) => resp,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const here = window.location.pathname;
      if (here !== '/settings') {
        window.location.assign('/settings');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
