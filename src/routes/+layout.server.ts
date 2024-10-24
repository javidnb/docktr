import { session } from '$lib/session';
import { dataLoading, appointments, appointmentsLoading, getUser } from '$lib/store/dataStore';
import type { Cookies } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
	let user = cookies.get('user');
	let uusData = null;
	let init = true;
	let bookings: any = null;
	let time = new Date().getTime();

	if (user) {
		let usr = JSON.parse(user);
		if (usr?.uid) {
			let uus = await fetch(`https://tekoplast.az/docktr/api/?user&id=${usr.uid}&t=${time}`);
			uusData = await uus.json();
			session.set({ user: uusData ? uusData : usr, loggedIn: true });
			if (init && uusData) {
				let res = await getAppointments(uusData);
				if (res) {
					bookings = res;
					appointments.set(res);
					appointmentsLoading.set(false);
				}

				init = false;
			}
		} else if (usr?.user?.uid) {
			let uus = await fetch(`https://tekoplast.az/docktr/api/?user&id=${usr.user.uid}&t=${time}`);
			uusData = await uus.json();
			session.set({ user: uusData ? uusData : usr.user, loggedIn: true });
			if (init && uusData) {
				let res = await getAppointments(uusData);
				if (res) {
					bookings = res;
					appointments.set(res);
					appointmentsLoading.set(false);
				}

				init = false;
			}
		} else {
			document.cookie = 'user=; path=/; max-age=0';
			session.set({ user: null, loggedIn: false });
			appointments.set([]);
			dataLoading.set(false);
		}
	} else {
		session.set({ user: null, loggedIn: false });
		appointments.set([]);
		dataLoading.set(false);
	}

	let doctors = await getDoctors();

	async function getAppointments(user: any) {
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
		const res = await result;
		return res;
	}

	async function getDoctors() {
		let time = new Date().getTime();
		const docs = await fetch(`https://tekoplast.az/docktr/api/?doctors&t=${time}`);
		const result: any = docs.json();
		const res = await result;
		return res;
	}

	return {
		user: user ?? null,
		appointments: bookings,
		doctors,
		uusData
	};
}
