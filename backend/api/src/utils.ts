import control from '@bp/control';
import { BpUser } from '@bp/types';
import { FastifyRequest } from 'fastify';

const BearerRXP = /[Bb]earer/g;

export async function loggedIn(req: FastifyRequest): Promise<BpUser | false> {
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
