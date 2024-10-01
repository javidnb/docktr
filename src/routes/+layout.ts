import { initializeFirebase, auth } from '$lib/firebase.client';
import { browser } from '$app/environment';
import { onAuthStateChanged } from 'firebase/auth';
import { appointmentsLoading, dataLoading, getUser } from '$lib/store/dataStore.js';
import { redirect } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export async function load({ url, data }) {
	if (browser) {
		initializeFirebase();
		setTimeout(async () => {
			try {
				const zipy = await import('zipyai');
				zipy.init('a88ea600');
				if (data?.uusData) {
					zipy.identify(data.uusData.uid, {
						displayName: data.uusData.displayName,
						email: data.uusData.email,
						phoneNumber: data.uusData.phoneNumber
					});
				}
			} catch (ex) {
				console.error(ex);
			}
		}, 1000);
	}

	if (data?.uusData && data?.uusData?.lang) {
		locale.set(data.uusData.lang);
	} else {
		locale.set('az');
	}

	if (data?.uusData && data.uusData?.doctor && url.pathname == '/') {
		throw redirect(302, '/doctor');
	}

	function getAuthUser() {
		return new Promise((resolve) => {
			onAuthStateChanged(auth, (user) => {
				if (user) {
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

	return {
		getAuthUser: getAuthUser,
		doctors: data.doctors,
		url: url.pathname,
		appointments: data.appointments,
		user: data.user,
		userData: data.uusData
	};
}
