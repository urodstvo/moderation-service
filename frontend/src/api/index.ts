import axios from 'axios';

export const AUTH_API_URL = 'http://localhost:8001/api/auth';

export * from './queries/login';

const api = axios.create({});

export default api;
