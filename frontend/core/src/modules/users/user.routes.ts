import { AuthBody, BpUser } from '@bp/types';
import { api } from '..';

export const Register = async (data: {
	username: string;
	email: string;
	password: string;
}) => api.live.post<AuthBody>('/users', data);

export const GetMe = async () => await api.live.get<BpUser>(`users/me`);

export const UpdateMe = async (updates: Partial<BpUser>) =>
	api.live.patch<BpUser>(`users/me`, updates);

export const GetById = async (id: string) =>
	await api.live.get<BpUser>(`users/${id}`);