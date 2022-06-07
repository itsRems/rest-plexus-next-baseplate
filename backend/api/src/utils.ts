import control from '@bp/control';
import { User } from '@prisma/client';
import { FastifyRequest } from 'fastify';

const BearerRXP = /[Bb]earer/g;

export async function loggedIn(req: FastifyRequest): Promise<User | false> {
	try {
		const authToken = req.headers['authorization'];
		if (!authToken) return false;
		const token = authToken.replace(BearerRXP, '').replace(' ', '');
		if (!token) return false;
		const user = await control.auth.verifyJwt(token);
		if (!user) return false;
		return {
			...user,
		};
	} catch (error) {
		return false;
	}
}
