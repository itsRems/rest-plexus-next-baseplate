import control from '@bp/control';
import { RouteOptions } from 'fastify';
import { loggedIn } from '../utils';

export const rgstr: RouteOptions = {
	url: '/',
	method: 'POST',
	handler: async function (req, res) {
		const { username, email, password } = req.body as any;

		if (!username || !email || !password) return res.status(400).send();

		const auth = await control.users.register(username, email, password);

		if (auth === 'duplicate_email')
			return res.status(409).send({
				duplicate: 'email',
			});

		if (auth === 'duplicate_username')
			return res.status(409).send({
				duplicate: 'username',
			});

		if (!auth) return res.status(500).send();

		return auth;
	},
};

export const me: RouteOptions = {
	url: '/me',
	method: 'GET',
	handler: async function (req, res) {
		const user = await loggedIn(req);
		if (!user) return res.status(401).send();
		return user;
	},
};

export const ptcme: RouteOptions = {
	url: '/me',
	method: 'PATCH',
	handler: async function (req, res) {
		const updates = req.body as any;
		if (!updates) return res.status(400).send();
		const user = await loggedIn(req);
		if (!user) return res.status(401).send();
		const updated = await control.users.updateUser(user.id, updates);
		if (!updated) return res.status(500).send();
		return updated;
	},
};

export const bid: RouteOptions = {
	url: '/:id',
	method: 'GET',
	handler: async function (req, res) {
		const { id } = req.params as any;
		if (!id) return res.status(400).send();
		const user = await control.users.getById(id);
		if (!user) return res.status(404).send();
		return user;
	},
};
