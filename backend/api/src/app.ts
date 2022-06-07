import control from '@bp/control';
import { initCache } from '@rocketplay/cache';
import { startServer } from './server';
import { extractEnv } from '@rocketplay/extractenv';

const API_PORT = Number(extractEnv('API_PORT', '1500'));

async function StartApi() {
	// Libs
	initCache({
		prefix: `bp`,
	});
	control.oauth.firebase.init();
	// API Server
	await startServer(1500);
	console.log(`[@BP/API] Web server up and running on port 1500`);
}

StartApi();