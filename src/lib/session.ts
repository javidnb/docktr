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
	whatsapp?: string;
	inAppNotifs?: boolean;
	emailNotifs?: string;
};

export type SessionState = {
	user: User | null;
	loading?: boolean;
	loggedIn?: boolean;
};

export const session = writable<SessionState>({ user: null });
