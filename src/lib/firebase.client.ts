import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, signOut } from 'firebase/auth';
import { getMessaging, type Messaging } from 'firebase/messaging';
import { getFirestore, type Firestore } from 'firebase/firestore';

import { browser } from '$app/environment';
import { session } from '$lib/session';
import { appointments, dataLoading } from './store/dataStore';

export let app: FirebaseApp;
export let auth: Auth;
export let messaging: Messaging;
export let db: Firestore;

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const initializeFirebase = (): Promise<void> => {
	return new Promise((resolve, reject) => {
		try {
			if (!browser) {
				throw new Error("Can't use the Firebase client on the server.");
			}
			if (!app) {
				app = initializeApp(firebaseConfig);
				auth = getAuth();
				messaging = getMessaging(app);
				db = getFirestore(app);
			}
			resolve();
		} catch (error) {
			reject(error);
		}
	});
};

function clearUserData() {
	setTimeout(() => {
		session.set({ user: null, loggedIn: false });
		appointments.set([]);
		localStorage.removeItem('user');
		dataLoading.set(false);
		localStorage.removeItem('msgs');
	}, 100);
}

export async function logout() {
	clearUserData();
	try {
		await signOut(auth);
		dataLoading.set(false);
	} catch (error) {
		console.error('Error signing out:', error);
		dataLoading.set(false);
	}
}
