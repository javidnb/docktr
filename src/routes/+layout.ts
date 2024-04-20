/** @type {import('./$types').LayoutLoad} */

import { initializeFirebase, auth } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';

let gotDs: boolean = false;

export async function load({ url }) {
	if (browser) {
		try {
			initializeFirebase();
		} catch (ex) {
			console.error(ex);
		}
	}

	function getAuthUser() {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, (user) => resolve(user ? user : false));
		});
	}

	async function getDoctors() {
		if (!gotDs) {
			// dataLoading.set(true);
			let time = new Date().getTime();
			const docs = await fetch(`https://tekoplast.az/docktr/api/?doctors&t=${time}`);
			const result: any = docs.json();
			const res = await result;
			gotDs = true;
			// dataLoading.set(false);
			return res;
		} else {
			return [];
		}
	}

	return {
		getAuthUser: getAuthUser,
		doctors: await getDoctors(),
		url: url.pathname
	};
}
