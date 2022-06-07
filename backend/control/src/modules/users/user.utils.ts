import { NyxUser } from '@nyx/types';
import { User } from '@prisma/client';

export function userToNyxUser(user: User): NyxUser {
	return {
		id: user.id,
		username: user.username,
		avatar: user.avatar,
		biography: user.biography,
		isAdmin: user.isAdmin,
	};
}
