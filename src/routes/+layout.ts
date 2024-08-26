/** @type {import('./$types').LayoutLoad} */

import { initializeFirebase, auth } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { session } from '$lib/session.js';
import { appointments, appointmentsLoading } from '$lib/store/dataStore.js';
import { goto } from '$app/navigation';

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
					console.log('getting users');
					getUser(user);
				}
				resolve(user ? user : false);
			});
		});
	}

	async function getUser(user: any) {
		try {
			let time = new Date().getTime();
			const response = await fetch(
				`https://tekoplast.az/docktr/api/?user&id=${user.uid}&t=${time}`
			);
			const result = await response.json();
			if (result.doctor) goto('./doctor');
			if (result) {
				session.set({
					user: { ...result, token: user.accessToken },
					loggedIn: true,
					loading: false
				});
				getAppointments(result);
				return null;
			}
			return result;
		} catch (error) {
			return null;
		}
	}

	async function getAppointments(user: any) {
		try {
			let time = new Date().getTime();
			let response;
			if (user.doctor) {
				response = await fetch(
					`https://tekoplast.az/docktr/api/?appointments&id=${user.doctor}&type=doctor&t=${time}`
				);
			} else {
				response = await fetch(
					`https://tekoplast.az/docktr/api/?appointments&id=${user.uid}&t=${time}`
				);
			}

			const result = await response.json();
			if (result) {
				appointments.set(result);
				appointmentsLoading.set(false);
				return null;
			}
			return response;
		} catch (error) {
			appointmentsLoading.set(false);
			return null;
		}
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
