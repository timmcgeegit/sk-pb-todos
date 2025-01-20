import { pb } from '$lib/pocketbase';
import { getContext, setContext } from 'svelte';

class AuthStore {
	user = $state(null);
	isSynced = $state(false);

	constructor() {
		// Set isSynced immediately if we have a valid auth
		if (pb.authStore.isValid) {
			this.user = pb.authStore.model;
			this.isSynced = true;
		} else {
			// If no valid auth, we can still mark as synced
			this.isSynced = true;
		}

		// Watch for auth changes
		$effect(() => {
			pb.authStore.onChange((token, model) => {
				this.user = model;
			});
		});
	}

	async signInWithDiscord() {
		this.user = (await pb.collection('users').authWithOAuth2({ provider: 'discord' })).record;
	}

	async signInWithGithub() {
		this.user = (await pb.collection('users').authWithOAuth2({ provider: 'github' })).record;
	}

	async signInWithEmail(email, password) {
		const authData = await pb.collection('users').authWithPassword(email, password);
		this.user = authData.record;
	}

	async signUp(email, password) {
		const user = await pb.collection('users').create({
			email,
			password,
			passwordConfirm: password
		});
		await this.signInWithEmail(email, password);
		return user;
	}

	logout() {
		pb.authStore.clear();
		this.user = null;
	}
}

// this is important if u are gonna have any SSR
// https://www.youtube.com/watch?v=EyDV5XLfagg
// https://kit.svelte.dev/docs/state-management

const AUTH_STORE_KEY = 'auth store';

export const setAuthContext = () => {
	const nAuthStore = new AuthStore();
	return setContext(AUTH_STORE_KEY, nAuthStore);
};

export const getAuthContext = () => {
	return getContext(AUTH_STORE_KEY);
};