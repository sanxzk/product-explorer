import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: import.meta.env.VITE_API_WITH_CREDENTIALS === 'true',
});

export default apiClient;
