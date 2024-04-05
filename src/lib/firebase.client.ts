import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import type { FirebaseApp } from 'firebase/app';
import type { Firestore } from 'firebase/firestore';
import type { Auth } from 'firebase/auth';
import { browser } from '$app/environment';

export let db: Firestore;
export let app: FirebaseApp;
export let auth: Auth;

const firebaseConfig = {
	apiKey: 'AIzaSyDv8kOrp_AL6mudWmsiYr53yR8cAn4hAYg',
	authDomain: 'ddocktr.firebaseapp.com',
	projectId: 'ddocktr',
	storageBucket: 'ddocktr.appspot.com',
	messagingSenderId: '1012984967438',
	appId: '1:1012984967438:web:9b90eb7220b41970dde75f',
	measurementId: 'G-0MLDQ5MDM6',
};

export const initializeFirebase = () => {
	if (!browser) {
		throw new Error("Can't use the Firebase client on the server.");
	}
	if (!app) {
		app = initializeApp(firebaseConfig);
		auth = getAuth(app);
	}
};