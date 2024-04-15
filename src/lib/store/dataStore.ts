import { writable } from 'svelte/store';
import type { Doctor } from '../interfaces/doctor.interface';

export const doctors = writable<Doctor[]>([]);
export const dataLoading = writable<boolean>(false);
