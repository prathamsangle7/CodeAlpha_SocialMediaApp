import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

const client = axios.create({ baseURL: API_BASE });

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// If the token is invalid for this backend (e.g. leftover from a different
// app sharing the same localhost origin), clear it instead of silently
// failing every request.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    return Promise.reject(error);
  }
);

export default client;
