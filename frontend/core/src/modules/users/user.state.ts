import { BpUser } from '@bp/types';
import { collection, computed, state } from '@plexusjs/core';
import channels from '../channels';

export const UserCollection = collection<BpUser>().createSelector('CURRENT');

export const UserComputed = {
	LOGGED_IN: computed<boolean>(() => {
		return UserCollection.selectors.CURRENT.value?.id ? true : false;
	}, [UserCollection.selectors.CURRENT]),
	HAS_CHANNEL: computed<boolean>(() => {
		// we need to add a `hasChannel` prop to
		// return UserCollection.selectors.CURRENT.value?.id ? UserCollection.selectors.CURRENT.value?.hasChannel : false
		// channels.loadChannelPage(UserCollection.selectors.CURRENT.value.username)
		return false;
	}, [UserCollection.selectors.CURRENT]),
};
