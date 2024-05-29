import axios from 'axios';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const AUTH_API_URL = '/auth';
export const PROFILE_API_URL = '/profile';
export const PASSWORD_API_URL = '/password';
export const EMAIL_API_URL = '/email';
export const ADMIN_API_URL = '/admin';

export * from './queries/login';
export * from './queries/register';
export * from './queries/getProfile';
export * from './queries/forgetPassword';
export * from './queries/resetPassword';
export * from './queries/changeRole';
export * from './queries/verifyUser';
export * from './queries/refreshToken';
export * from './queries/requestVerification';
export * from './queries/emailVerification';
export * from './queries/generateToken';
export * from './queries/moderateRequest';
export * from './queries/getAdminStats';
export * from './queries/getAdminUsers';
export * from './queries/acceptRole';

export * from './requests/refreshToken';
export * from './requests/verifyUser';

const api = axios.create({ withCredentials: true, baseURL: API_URL });

export default api;
