import { writable } from 'svelte/store';
import type { Doctor } from '../interfaces/doctor.interface';
import { toast } from '@zerodevx/svelte-toast';
import { browser } from '$app/environment';
import { session } from '$lib/session';
import { goto } from '$app/navigation';

export const doctors = writable<Doctor[]>([]);
export const appointments = writable<any[]>([]);
export const dataLoading = writable<boolean>(true);
export const showModalSig = writable(false);
export const loginModal = writable(false);
export const appointmentModal = writable(false);
export const confirmationModal = writable(false);
export const reviewModal = writable(false);
export const selectedAppointmentDate = writable({ day: null, time: null, start: null, end: null });
export const selectedBranch: any = writable();
export const selectedSymptoms: any = writable([]);
export const showBtnEndCall = writable(false);
export const joinVideoCall = writable(false);
export const ongoingAppointment = writable<any>();
export const users:any = writable([]);
export const selectedUser = writable();
export const hideNav = writable(false);
export const appointmentsLoading = writable(false);
export const termsAccepted = writable(false);
export const showTermsModal = writable(false);
export const searchQuery = writable('');
export const showGPT = writable(false);
export const mobileComponent: any = writable(null);
export const mobileHeader: any = writable('Menyu');
export const limitDashboardData = writable(true); // this is for admin page, to get only limited data in homepage
export const comission = writable(15);

export const langs: any = [
	{ value: 'aze', label: 'Azərbaycanca' },
	{ value: 'eng', label: 'İngiliscə' },
	{ value: 'ru', label: 'Rusca' },
	{ value: 'turk', label: 'Türkcə' },
	{ value: 'iran', label: 'Farsca' },
	{ value: 'french', label: 'Fransızca' }
];

export const nationality: any = [
	{ value: 'aze', label: 'Azərbaycan' },
	{ value: 'turk', label: 'Türk' },
	{ value: 'iran', label: 'İran' }
];

export const countryNos = [
	{ value: '+994', label: '+994' },
	{ value: '+90', label: '+90' },
	{ value: '+98', label: '+98' }
];

const charMap: any = {
	ç: 'c',
	ğ: 'g',
	ı: 'i',
	ö: 'o',
	ş: 's',
	ü: 'u',
	Ç: 'C',
	Ğ: 'G',
	İ: 'I',
	Ö: 'O',
	Ş: 'S',
	Ü: 'U',
	Ə: 'E',
	ə: 'e'
};

export function latinize(str: string) {
	return str
		.replace(/[çğıöşüÇĞİÖŞÜƏə]/g, (match) => charMap[match])
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/\s+/g, '-');
}

export const pageId: any = writable(null);
export const nextPageId: any = writable(null);

export function slideIn(node: HTMLElement, { duration = 80 }: { duration?: number } = {}) {
	return {
		duration,
		css: (t: number) => {
			const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
			const x = 50 - 50 * easedT;
			const opacity = easedT; // from 0 to 1
			return `transform: translateX(${x}px);
			opacity: ${opacity};`;
		}
	};
}

export function zoomIn(node: HTMLElement, { duration = 80 }: { duration?: number } = {}) {
	return {
		duration,
		css: (t: number) => {
			const opacity = 0.3 + 0.7 * t;
			const scale = 0.97 + 0.03 * t; // from 1.1 to 1
			return `				
				opacity: ${opacity};
				transform: scale(${scale});	
			`;
		}
	};
}

export function zoomOut(node: HTMLElement, { duration = 50 }: { duration?: number } = {}) {
	return {
		duration,
		css: (t: number) => {
			// Scale from 1 to 0.97 as t goes from 0 to 1
			const scale = 1 - 0.03 * t;
			return `
				transform: scale(${scale});
			`;
		},
		tick: (t: number) => {
			// At the end of the animation, ensure the final scale is applied
			if (t === 1) {
				node.style.transform = `scale(0.97)`;
			}
		}
	};
}


export const mobile = writable();

if (browser)
	mobile.set(/android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent));

export async function putData(
	table: string,
	primaryColName: string,
	id: string | number,
	data: any,
	disableLoading?: boolean
) {
	if (!disableLoading) dataLoading.set(true);

	let requestData = {
		table,
		primaryColName,
		id,
		data: { ...data }
	};
	const response = await fetch('https://tekoplast.az/docktr/api/?putData', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ ...requestData }),
		cache: 'no-cache'
	});

	if (response.ok) {
		// toast.push('Uğurlu!', {
		// 	duration: 2000,
		// 	theme: {
		// 		'--toastColor': 'mintcream',
		// 		'--toastBackground': 'rgb(91 144 77)',
		// 		'--toastBarBackground': '#1d5b3c'
		// 	}
		// });
		if (!disableLoading) dataLoading.set(false);
		return 'ok';
	} else {
		toast.push('Xəta!', {
			duration: 2000,
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgb(176 24 24)',
				'--toastBarBackground': '#5b1010'
			}
		});
		dataLoading.set(false);
		return 'error';
	}
}

export async function postData(table: string, data: any) {
	let dataToPost = { table: table, data: { ...data } };
	const response = await fetch('https://sehiyye.net/api/postData', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ ...dataToPost }),
		cache: 'no-cache'
	});

	if (response.ok) {
		dataLoading.set(false);
		return 'ok';
	} else {
		dataLoading.set(false);
		return 'error';
	}
}

export async function sendNotification(uid: string, title?: string, body?: string, url?: string) {
	let requestData = {
		uid,
		title,
		body,
		url
	};
	const response = await fetch(`https://sehiyye.net/api/pushNotification`, {
		method: 'POST',
		body: JSON.stringify({ ...requestData })
	});

	if (response.ok) {
		dataLoading.set(false);
	} else {
		dataLoading.set(false);
	}
}

export async function getUser(user: any) {
	dataLoading.set(false);
	let usr = user.user ? user.user : user;
	let time = new Date().getTime();
	const response = await fetch(`https://tekoplast.az/docktr/api/?user&id=${usr.uid}&t=${time}`);
	const result = await response.json();
	if (result?.doctor) goto('/doctor');
	if (result) {
		getAppointments(result);
	}
	session.set({
		user: result,
		loggedIn: true,
		loading: false
	});
	dataLoading.set(false);
	return response;

	// FIRESTORE
	// let usr = user.user ? user.user : user;

	// let data = {
	// 	uid: usr.uid,
	// 	displayName: usr.displayName,
	// 	email: !usr.email.endsWith('@sehiyye.online') ? usr.email : null,
	// 	phoneNumber: usr.email.endsWith('@sehiyye.online')
	// 		? usr.email.substring(0, usr.email.length - 15)
	// 		: null,
	// 	photoURL: usr?.photoURL,
	// 	fcmToken: usr?.fcmToken || null
	// };

	// const docRef = doc(db, 'users', usr.uid);
	// const docSnap = await getDoc(docRef);

	// if (docSnap.exists()) {
	// 	session.set({
	// 		user: docSnap.data(),
	// 		loggedIn: true,
	// 		loading: false
	// 	});
	// 	dataLoading.set(false);
	// 	getAppointments(docSnap.data());
	// 	if (docSnap.data().doctor) goto('/doctor');
	// } else {
	// 	await setDoc(docRef, data);
	// 	session.set({
	// 		user: data,
	// 		loggedIn: true,
	// 		loading: false
	// 	});
	// 	dataLoading.set(false);
	// }
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
			dataLoading.set(false);
			return null;
		}
		return response;
	} catch (error) {
		getAppointments(user);
		console.error(error);
		dataLoading.set(false);
		return null;
	}

	// FIRESTORE
	// const q = query(
	// 	collection(db, 'appointments'),
	// 	where('participants', 'array-contains', user.uid)
	// );
	// const result = await getDocs(q);
	// const data = result.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function cancelAppointment(appointmentId: number, userId: any) {
	try {
		let data = { appointmentId, userId };
		const response = await fetch('https://sehiyye.net/api/cancelAppointment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ ...data })
		});

		if (!response.ok) {
			throw new Error(`Error: ${response.status}`);
		}

		const result = await response.json();
		console.log(result);
		return result;
	} catch (error) {
		console.error('Error canceling appointment:', error);
		return { status: 'error', message: error };
	}
}
