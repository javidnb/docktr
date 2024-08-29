/** @type {import('./$types').LayoutLoad} */

import { initializeFirebase, auth, db } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { appointments, appointmentsLoading, dataLoading, getUser } from '$lib/store/dataStore.js';

let doctorsData: any = null;

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
			onAuthStateChanged(auth, (user) => {
				if (user) {
					getUser(user);
				} else {
					dataLoading.set(false);
					appointmentsLoading.set(false);
				}
				resolve(user ? user : false);
			});
		});
	}

	if (!doctorsData) {
		doctorsData = await getDoctors();
	}

	async function getDoctors() {
		let time = new Date().getTime();
		const docs = await fetch(`https://tekoplast.az/docktr/api/?doctors&t=${time}`);
		const result: any = docs.json();
		const res = await result;
		return res;
	}

	return {
		getAuthUser: getAuthUser,
		doctors: doctorsData,
		url: url.pathname
	};
}
