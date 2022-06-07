import { IoEvent } from '@bp/types';
import { state } from '@plexusjs/core';
import api from '../api';
import { socket } from '../chat/chat.io';

export const AuthState = {
	TOKEN: state('').key('auth.token').persist('auth.token'),
	REFRESH_TOKEN: state('')
		.key('auth.refreshToken')
		.persist('auth.refreshToken'),
	MODAL_STATE: state<'none' | 'login' | 'register'>('none'),
};

AuthState.TOKEN.watch((token) => {
	api.live.auth(token, 'bearer');
	socket.emit('auth' as IoEvent, token);
});
