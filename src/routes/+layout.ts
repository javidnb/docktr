import { initializeFirebase, auth } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { appointmentsLoading, dataLoading, getUser } from '$lib/store/dataStore.js';

let doctorsData: any = null;

export async function load({ url, data }) {
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
					console.log('getting user');
					document.cookie = `user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${7 * 24 * 60 * 60}`;
					getUser(user);
				} else {
					document.cookie = 'user=; path=/; max-age=0';
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
		doctors: data.doctors,
		url: url.pathname,
		appointments: data.appointments,
		user: data.user,
		userData: data.uusData
	};
}
