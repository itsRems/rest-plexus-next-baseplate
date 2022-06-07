import * as actions from './auth.actions';
import { AuthState } from './auth.state';

export default {
	state: AuthState,
	...actions,
};
