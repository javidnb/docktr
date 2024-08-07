import { writable } from 'svelte/store';
import type { Doctor } from '../interfaces/doctor.interface';
import { toast } from '@zerodevx/svelte-toast';
import { browser } from '$app/environment';

export const doctors = writable<Doctor[]>([]);
export const appointments = writable<any[]>([]);
export const dataLoading = writable<boolean>(false);
export const showModalSig = writable(false);
export const loginModal = writable(false);
export const appointmentModal = writable(false);
export const confirmationModal = writable(false);
export const selectedAppointmentDate = writable({ day: null, time: null, start: null, end: null });
export const selectedBranch: any = writable();
export const selectedSymptoms: any = writable([]);
export const showBtnEndCall = writable(false);
export const joinVideoCall = writable(false);
export const ongoingAppointment = writable<any>();
export const users = writable([]);
export const selectedUser = writable();
export const hideNav = writable(false);
export const appointmentsLoading = writable(true);

export const langs: any = [
	{ value: 'aze', label: 'Azərbaycanca' },
	{ value: 'eng', label: 'İngiliscə' },
	{ value: 'ru', label: 'Rusca' },
	{ value: 'turk', label: 'Türkcə' },
	{ value: 'iran', label: 'Farsca' }
];

export const nationality: any = [
	{ value: 'aze', label: 'Azərbaycan' },
	{ value: 'turk', label: 'Türk' },
	{ value: 'iran', label: 'İran' }
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
	console.log('request data: ', requestData);
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
		console.log('response: ', response.json());
		return 'error';
	}
}

export async function postData(table: string, data: any) {
	let dataToPost = { table: table, data: { ...data } };
	const response = await fetch('https://tekoplast.az/docktr/api/?postData', {
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

export async function sendNotification(
	uid: string,
	doctor: boolean,
	title?: string,
	body?: string,
	url?: string
) {
	let time = new Date().getTime();
	const fcmToken = doctor
		? await fetch(`https://tekoplast.az/docktr/api/?getTokens&uid=${uid}&type=doctor&t=${time}`)
		: await fetch(`https://tekoplast.az/docktr/api/?getTokens&uid=${uid}&t=${time}`);
	const fcmTokens = await fcmToken.json();

	let requestData = {
		tokens: JSON.stringify(fcmTokens[0].fcmToken),
		title,
		body,
		url
	};
	const response = await fetch(`https://tekoplast.az/docktr/api/?pushNotification`, {
		method: 'POST',
		cache: 'no-store',
		body: JSON.stringify({ ...requestData })
	});

	if (response.ok) {
		dataLoading.set(false);
	} else {
		dataLoading.set(false);
	}
}
