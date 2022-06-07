import { BpUser } from '@bp/types';
import { User } from '@prisma/client';

export function userToBpUser(user: User): BpUser {
	return {
		id: user.id,
		username: user.username,
		avatar: user.avatar,
		biography: user.biography,
		isAdmin: user.isAdmin,
	};
}
