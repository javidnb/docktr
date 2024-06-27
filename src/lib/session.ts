import { browser } from '$app/environment';
import { writable, type Writable } from 'svelte/store';

export type User = {
	email?: string | null;
	displayName?: string | null;
	photoURL?: string | null;
	phoneNumber?: any;
	uid?: string | null;
	doctor?: boolean;
	admin?: boolean;
	fcmToken?: string;
	accessToken?: string;
	lang?: string;
};

export type SessionState = {
	user: User | null;
	loading?: boolean;
	loggedIn?: boolean;
};

let user = null;
if (browser) {
	user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? '') : null;
}

export const session = writable<SessionState>({ user: null });

if (user) {
	session.set({ ...user, loggedIn: true });
}
