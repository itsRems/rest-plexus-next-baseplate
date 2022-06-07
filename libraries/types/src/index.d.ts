import { User as PrismaUser } from '@prisma/client';

type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type BpUser = Omit<
	PartialBy<
		PrismaUser,
		| 'email'
		| 'updatedAt'
	>,
	'password'
>;

export interface TokenSetBody {
	token: string;
	refreshToken: string;
}

export interface AuthBody extends TokenSetBody {
	user: BpUser;
}