import { BpUser } from '@bp/types';
import { action } from '@plexusjs/core';
import toast from 'react-hot-toast';
import { auth } from '..';
import api from '../api';
import * as routes from './user.routes';
import { UserCollection } from './user.state';

export const register = action(
	async (_, username: string, email: string, password: string) => {
		const { data, status } = await routes.Register({
			username,
			email,
			password
		});
		if (status === 200) {
			auth.handleAuthData(data);
			auth.state.MODAL_STATE.set('none');
			return;
		}
		if (status === 409) {
			if ((data as any)?.duplicate)
				toast.error(
					`This ${
						(data as any)?.duplicate === 'email' ? 'email' : 'username'
					} is already in use.`
				);
			else toast.error(`This email or username is already in use.`);
		}
	}
);

export const loadUser = action(async (_, id: string, groups: string[] = []) => {
	const { data, ok } = await routes.GetById(id);
	if (ok) UserCollection.collect(data, groups);
});

export const loadMissingUsers = action(async (_, ids: string[]) => {
	ids = ids.filter((id) => !UserCollection.keys.includes(id));
	await Promise.all(ids.map((id) => loadUser(id)));
});

export const updateMe = action(async (_, updates: Partial<BpUser>) => {
	const { ok, data } = await routes.UpdateMe(updates);
	if (ok) UserCollection.update(data.id, updates);
});
