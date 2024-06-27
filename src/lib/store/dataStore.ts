import { writable } from 'svelte/store';
import type { Doctor } from '../interfaces/doctor.interface';
import { toast } from '@zerodevx/svelte-toast';

export const doctors = writable<Doctor[]>([]);
export const appointments = writable<any[]>([]);
export const dataLoading = writable<boolean>(false);
export const showModalSig = writable(false);
export const loginModal = writable(false);
export const appointmentModal = writable(false);
export const confirmationModal = writable(false);
export const selectedAppointmentDate = writable({ day: null, time: null, start: null, end: null });
export const selectedBranch: any = writable('0');
export const selectedSymptoms: any = writable([]);
export const showBtnEndCall = writable(false);

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
