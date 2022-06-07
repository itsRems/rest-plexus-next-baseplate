import control from '@bp/control';
import { RouteOptions } from 'fastify';

export const lgn: RouteOptions = {
	url: '/password',
	method: 'POST',
	handler: async function (req, res) {
		const { emailOrUsername, password } = req.body as any;

		if (!emailOrUsername || !password) return res.status(400).send();

		const auth = await control.auth.passwordLogin(emailOrUsername, password);

		if (!auth) return res.status(403).send();

		return auth;
	},
};

export const rfrsh: RouteOptions = {
	url: '/refresh',
	method: 'POST',
	handler: async function (req, res) {
		const { token, refreshToken } = req.body as any;
		if (!token || !refreshToken) return res.status(400).send();
		const refresh = await control.auth.refreshTokenSet(token, refreshToken);
		if (!refresh) return res.status(500).send();
		if (refresh === 'reject') return res.status(403).send();
		return refresh;
	},
};
