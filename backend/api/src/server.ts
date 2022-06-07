import fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import { registerRoutes } from './loader';

const server = fastify({
	logger: false /** process.env.NODE_ENV !== "production" */,
	bodyLimit: 1048576 * 50,
});

export async function startServer(port: number = 1500) {
	server.register(fastifyCors, {
		// options
	});
	await registerRoutes(server);
	server.ready().then(() => console.log(server.printRoutes()));
	process.on('SIGTERM', () => {
		server.close();
	});
	return await server.listen(port, '0.0.0.0');
}
