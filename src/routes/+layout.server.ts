import { session } from '$lib/session';
import { dataLoading, appointments, appointmentsLoading } from '$lib/store/dataStore';
import type { Cookies } from '@sveltejs/kit';

export async function load({ cookies }: { cookies: Cookies }) {
	const user = cookies.get('user');
	let init = true;
	let bookings: any = null;

	if (user) {
		let usr = JSON.parse(user);
		if (usr.uid) {
			session.set({ user: JSON.parse(user), loggedIn: true });
			if (init) {
				let res = await getAppointments(usr);
				bookings = res;
				appointments.set(res);
				appointmentsLoading.set(false);
				init = false;
			}
		}
	} else {
		session.set({ user: null, loggedIn: false });
		dataLoading.set(false);
	}

	async function getAppointments(user: any) {
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
		const res = await result;
		return res;
	}

	return {
		user,
		appointments: bookings
	};
}
