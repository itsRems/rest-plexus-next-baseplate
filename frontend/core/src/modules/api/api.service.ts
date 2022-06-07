import { api } from '@plexusjs/core';

export const APIv1 = api(
	process.env.NEXT_PUBLIC_API_URL || 'http://localhost:1500'
).headers({
	'Content-Type': 'application/json',
});
