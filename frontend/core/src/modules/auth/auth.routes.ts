import { AuthBody, BpUser } from '@bp/types';
import { api } from '..';

export const PasswordLogin = async (data: {
	emailOrUsername: string;
	password: string;
}) => api.live.post<AuthBody>('/auth/password', data);

export const RefreshTokenSet = async (token: string, refreshToken: string) =>
	await api.live.post<AuthBody>(`auth/refresh`, { token, refreshToken });