import { AuthBody, BpUser, TokenSetBody } from '@bp/types';
import { User } from '@prisma/client';
import { extractEnv } from '@rocketplay/extractenv';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { clients } from '..';
import * as utils from './auth.utils';

const jwtKey = extractEnv('JWT_KEY', 'I LOVE JWT WOOOOOOOOOOOOOOO');

export async function generateTokenSet(
	user: User | BpUser
): Promise<TokenSetBody> {
	try {
		// @ts-ignore
		delete user.password;
		const token = jwt.sign(user, jwtKey, {
			expiresIn: '48h',
		});
		const refreshToken = nanoid(60).replace('-', '');
		await clients.prisma.refreshToken.create({
			data: {
				userId: user.id,
				refreshToken,
			},
		});
		return { token, refreshToken };
	} catch (error) {
		console.log('Token Set Generation error', error);
		return undefined;
	}
}

export async function verifyJwt(token: string): Promise<BpUser> {
	try {
		if (!token) return undefined;
		const decoded: any = jwt.verify(token, jwtKey);
		if (decoded) {
			const user = await clients.prisma.user.findFirst({
				where: { id: decoded.id },
				select: clients.prisma.$exclude('user', ['password']),
			});
			if (user) return user;
		}
		return undefined;
	} catch (error) {
		return undefined;
	}
}

const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000;

export async function refreshTokenSet(
	token: string,
	refreshToken: string
): Promise<AuthBody | 'reject'> {
	try {
		const decoded: any = jwt.verify(token, jwtKey, {
			ignoreExpiration: true,
		});
		if (!decoded) return 'reject';
		const user = await clients.prisma.user.findFirst({
			where: { id: decoded.id, email: decoded.email },
		});
		if (!user) return 'reject';
		const validRefresh = await clients.prisma.refreshToken.findFirst({
			where: { userId: user.id, refreshToken },
		});
		if (!validRefresh) return 'reject';
		if (new Date(validRefresh.createdAt).getTime() + REFRESH_TOKEN_TTL < Date.now()) {
			await clients.prisma.refreshToken.delete({
				where: { id: validRefresh.id },
			});
			return 'reject';
		}
		const auth = await generateTokenSet(user);
		if (!auth) return 'reject';
		await clients.prisma.refreshToken.delete({
			where: { id: validRefresh.id },
		});
		return {
			...auth,
			user,
		};
	} catch (error) {
		console.log('refresh token set error', error);
		return 'reject';
	}
}

export async function passwordLogin(
	emailOrUsername: string,
	password: string
): Promise<AuthBody> {
	const user = await clients.prisma.user.findFirst({
		where: {
			OR: [
				{
					email: {
						equals: emailOrUsername,
						mode: 'insensitive',
					},
				},
				{
					username: {
						equals: emailOrUsername,
						mode: 'insensitive',
					},
				},
			],
		},
	});
	if (!user) return undefined;
	if (!(await utils.comparePasswords(password, user.password)))
		return undefined;
	const tokenSet = await generateTokenSet(user);
	return {
		...tokenSet,
		user,
	};
}
