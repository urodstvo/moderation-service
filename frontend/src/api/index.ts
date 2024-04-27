import axios from 'axios';

export const AUTH_API_URL = 'http://localhost:8001/api/auth';
export const PROFILE_API_URL = 'http://localhost:8001/api/profile';
export const PASSWORD_API_URL = 'http://localhost:8001/api/password';

export * from './queries/login';
export * from './queries/register';
export * from './queries/getProfile';
export * from './queries/forgetPassword';
export * from './queries/resetPassword';
export * from './queries/changeRole';

export * from './requests/refreshToken';
export * from './requests/verifyUser';

const api = axios.create({ withCredentials: true });

export default api;
