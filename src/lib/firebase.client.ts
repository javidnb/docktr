import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getMessaging, type Messaging } from 'firebase/messaging';

import { browser } from '$app/environment';
import { session } from '$lib/session';
import { appointments } from './store/dataStore';

export let app: FirebaseApp;
export let auth: Auth;
export let messaging: Messaging;

const firebaseConfig = {
	apiKey: 'AIzaSyDv8kOrp_AL6mudWmsiYr53yR8cAn4hAYg',
	authDomain: 'ddocktr.firebaseapp.com',
	projectId: 'ddocktr',
	storageBucket: 'ddocktr.appspot.com',
	messagingSenderId: '1012984967438',
	appId: '1:1012984967438:web:9b90eb7220b41970dde75f',
	measurementId: 'G-0MLDQ5MDM6'
};

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
		messaging = getMessaging(app);
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
