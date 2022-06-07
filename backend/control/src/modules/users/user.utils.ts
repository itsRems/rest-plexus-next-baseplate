import { BpUser } from '@bp/types';
import { User } from '@prisma/client';

export function cleanUser (user: User): BpUser {
	return {
		id: user.id,
		username: user.username,
		isAdmin: user.isAdmin,
	};
}
