import * as actions from './user.actions';
import * as routes from './user.routes';
import { UserCollection, UserComputed } from './user.state';

export default {
	collection: UserCollection,
	computed: UserComputed,
	routes,
	LOGGED_IN: UserComputed.LOGGED_IN,
	...actions,
};
