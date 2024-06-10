import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, GoogleAuthProvider } from 'firebase/auth';
import { getMessaging, type Messaging } from 'firebase/messaging';

import { browser } from '$app/environment';
import { session } from '$lib/session';
import { appointments } from './store/dataStore';

export let app: FirebaseApp;
export let auth: Auth;
export let messaging: Messaging;
export let provider: GoogleAuthProvider;

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
		messaging = getMessaging(app);
		provider = new GoogleAuthProvider();
	}
};

export function logout() {
	auth
		.signOut()
		.then(() => {
			session.set({ user: null });
			appointments.set([]);

			localStorage.removeItem('user');
			// Redirect or perform any other actions after logout
			// navigate('/login');
		})
		.catch((error) => {
			console.error('Error logging out:', error);
		});
}
