import { session } from '$lib/session';
import type { Cookies } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
	const user = cookies.get('user');

	if (user) {
		session.set({ user: JSON.parse(user), loggedIn: true });
	} else {
		session.set({ user: null, loggedIn: false });
	}

	return {
		user
	};
}
