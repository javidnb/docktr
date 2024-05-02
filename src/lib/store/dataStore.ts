import { writable } from 'svelte/store';
import type { Doctor } from '../interfaces/doctor.interface';
import { toast } from '@zerodevx/svelte-toast';

export const doctors = writable<Doctor[]>([]);
export const dataLoading = writable<boolean>(false);
export const showModal = writable(false);
export const modul = writable(false);
export const selectedAppointmentDate = writable({day:null, time: null});

export async function putData(table: string, colId: string, id: string | number, data: any) {
	dataLoading.set(true);

	let requestData = {
		table,
		colId,
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
		toast.push('Uğurlu!', {
			duration: 2000,
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgb(91 144 77)',
				'--toastBarBackground': '#1d5b3c'
			}
		});
		dataLoading.set(false);
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
	}
}
