import { AuthBody } from '@bp/types';
import { action, preaction } from '@plexusjs/core';
import toast from 'react-hot-toast';
import { api, users } from '..';
import * as routes from './auth.routes';
import { AuthState } from './auth.state';

/**
 * Preaction to load a pre-authed user into the app
 */
preaction(async () => {
	// Don't run preaction in ssr
	if (typeof window === undefined) return;
	const [jwt, refreshToken] = [
		AuthState.TOKEN.value,
		AuthState.REFRESH_TOKEN.value,
	];
	if (!jwt) return;
	api.live.auth(jwt, 'bearer');
	const { data, status } = await users.routes.GetMe();
	if (status === 200) {
		users.collection.collect(data, 'myAccounts');
		users.collection.selectors.CURRENT.select(data.id);
	}
	if ([401, 403].includes(status) && refreshToken) {
		const refreshReq = await routes.RefreshTokenSet(jwt, refreshToken);
		if (refreshReq.status === 200) handleAuthData(refreshReq.data);
		if ([401, 403].includes(refreshReq.status)) {
			Logout();
			AuthState.MODAL_STATE.set('login');
		}
	}
});

export const passwordLogin = action(
	async (_, emailOrUsername: string, password: string) => {
		const { data, ok } = await routes.PasswordLogin({
			emailOrUsername,
			password,
		});
		if (ok) {
			AuthState.MODAL_STATE.set('none');
			return handleAuthData(data);
		} else {
			throw new Error('Login Failed');
		}
	}
);

export function handleAuthData(data: AuthBody) {
	users.collection.collect(data.user, 'myAccounts');
	users.collection.selectors.CURRENT.select(data.user.id);
	AuthState.TOKEN.set(data.token);
	AuthState.REFRESH_TOKEN.set(data.refreshToken);
}

export const Logout = action(() => {
	const me = users.collection.selectors.CURRENT.id;
	if (me) users.collection.delete(me);
	users.collection.selectors.CURRENT.select('');
	AuthState.TOKEN.set('');
	AuthState.REFRESH_TOKEN.set('');
});