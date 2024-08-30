import { session } from '$lib/session';
import { dataLoading } from '$lib/store/dataStore';
import type { Cookies } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
	const user = cookies.get('user');

	if (user) {
		let usr = JSON.parse(user);
		if (usr.uid) {
			session.set({ user: JSON.parse(user), loggedIn: true });
		}
	} else {
		session.set({ user: null, loggedIn: false });
		dataLoading.set(false);
	}

	return {
		user
	};
}
