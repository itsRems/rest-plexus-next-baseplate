import { AuthBody, BpUser } from '@bp/types';
import { Prisma, User } from '@prisma/client';
import { cacheItem, getCached } from '@rocketplay/cache';
import { auth, clients } from '..';
import * as utils from './user.utils';

export async function register(
	username: string,
	email: string,
	password: string
): Promise<AuthBody | 'duplicate_email' | 'duplicate_username'> {
	let duplicateUser = await clients.prisma.user.findFirst({
		where: {
			OR: [
				{
					username: {
						equals: username,
						mode: 'insensitive',
					},
				},
				{
					email: {
						equals: email,
						mode: 'insensitive',
					},
				},
			],
		},
	});

	if (duplicateUser) {
		if (duplicateUser?.email?.toLowerCase() === email.toLowerCase())
			return 'duplicate_email';
		if (duplicateUser?.username?.toLowerCase() === username.toLowerCase())
			return 'duplicate_username';
	}

	const user = await clients.prisma.user.create({
		data: {
			email,
			username,
			password: await auth.utils.encryptPassword(password),
		},
		select: clients.prisma.$exclude('user', ['password']),
	});
	const tokenSet = await auth.generateTokenSet(user);
	return {
		user,
		...tokenSet,
	};
}

export async function getById(id: string): Promise<BpUser> {
	const cacheKey = `get-user-id[${id}]`;
	const cached = await getCached(cacheKey);
	if (cached) return cached;
	const user = await clients.prisma.user.findUnique({
		where: {
			id,
		},
		select: clients.prisma.$exclude('user', [
			'password',
			'email',
		]),
	});
	await cacheItem(cacheKey, user);
	return user;
}

export async function updateUser(
	id: string,
	data: Partial<Prisma.UserUpdateInput>
): Promise<BpUser> {
	for (const key in data) {
		// @TODO NO USERNAME
		if (['password', 'email', 'id', 'isAdmin'].includes(key)) {
			delete data[key];
		}
	}
	const u = await clients.prisma.user.update({
		where: {
			id,
		},
		data,
	});
	return utils.cleanUser(u);
}
