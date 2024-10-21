<script lang="ts">
	import { session } from '$lib/session';
	import {
		dataLoading,
		doctors,
		drAvlblHrs,
		mobile,
		putData,
		selectedAppointmentDate
	} from '$lib/store/dataStore';
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import { toast } from '@zerodevx/svelte-toast';
	import { writable } from 'svelte/store';

	export let showDatePicker: boolean = false;
	export let selectedDay: any = null;
	export let selectedWeekDay: any = 1;
	export let editHours: boolean = false;
	export let doc: any = null;
	export let appointmentDate: any = null;
	export let docAppointments: any = null;

	let daysOfWeek: any = [];
	let availableHours: any = {};
	let availableHoursOrigin: any = {}; // for checking if there is a change
	let classChange = writable(1);

	let doctor: boolean = false;
	let accountActive: boolean = false;
	let accountActiveOrigin: boolean = false;
	let allowAll: boolean = false;
	let pageHeight: any = null;

	let dataUpdated: boolean = false;

	// for users to get new appoinment
	function getDatesFromTomorrow(numDays: any) {
		const daysOfWeek = [];
		let currentDate = new Date();
		for (let i = 0; i < numDays; i++) {
			currentDate.setDate(currentDate.getDate() + 1);
			const day = getAzerbaijaniDay(currentDate.getDay() == 0 ? 6 : currentDate.getDay() - 1);
			const date = formatDate(currentDate);
			daysOfWeek.push({ day, date, weekday: currentDate.getDay() == 0 ? 7 : currentDate.getDay() });
		}
		return daysOfWeek;
	}

	// for doctors to set available hours during week
	function getWeekDays() {
		const daysOfWeek = [];
		const currentDate = new Date();
		const dayIndex = (currentDate.getDay() + 6) % 7;
		const startOfWeek = new Date(currentDate);
		startOfWeek.setDate(currentDate.getDate() - dayIndex);

		for (let i = 0; i < 7; i++) {
			const date = new Date(startOfWeek);
			date.setDate(startOfWeek.getDate() + i); // Get each day from Monday to Sunday
			const day = getAzerbaijaniDay(i); // Get the day name
			const formattedDate = formatDate(date); // Format the date
			daysOfWeek.push({ day, date: formattedDate, weekday: date.getDay() });
		}
		return daysOfWeek;
	}

	function formatDate(date: any) {
		const day = String(date.getDate()).padStart(2, '0');
		const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
		return `${day} ${month}`;
	}

	function getAzerbaijaniDay(dayIndex: number) {
		const azerbaijaniDays = [
			'Bazar er.',
			'Çərş. axş.',
			'Çərşənbə',
			'Cümə axş.',
			'Cümə',
			'Şənbə',
			'Bazar'
		];
		return azerbaijaniDays[dayIndex];
	}

	onMount(async () => {
		if (window.visualViewport) {
			pageHeight = window.visualViewport?.height;
			window.visualViewport.addEventListener('resize', () => {
				pageHeight = window.visualViewport?.height;
			});
		}

		if ($session.user && $session.user.doctor && editHours) {
			doctor = true;
			let docktr = $doctors.find((d) => d.id == $session.user?.doctor);
			if (docktr && docktr.availableHours) {
				availableHours = JSON.parse(docktr.availableHours);
				availableHoursOrigin = availableHours;
			} else {
				allowAll = true;
			}
			if (docktr && docktr.disableAppointments) {
				accountActive = docktr.disableAppointments == true ? false : true;
				accountActiveOrigin = accountActive;
			} else {
				accountActive = true;
				accountActiveOrigin = accountActive;
			}
		}

		if (doctor) {
			daysOfWeek = getWeekDays();
			selectedDay = daysOfWeek[0].date;
			selectedWeekDay = daysOfWeek[0].weekday;
			classChange.set($classChange + 1);
		} else {
			// USER GETTING APPOINTMENT FROM DOC
			try {
				if (doc && docAppointments) {
					if (doc.availableHours) {
						availableHours = JSON.parse(doc.availableHours);
						availableHoursOrigin = availableHours;

						docAppointments.forEach((d: any) => {
							let wday = new Date(d.startTime).getDay();
							const index = availableHours[wday].findIndex(
								(item: any) =>
									item ==
									`${new Date(d.startTime).getHours().toString().padStart(2, '0')}:${new Date(d.startTime).getMinutes().toString().length == 2 ? new Date(d.startTime).getMinutes() : new Date(d.startTime).getMinutes().toString() + 0}`
							);
							if (index !== -1) {
								availableHours[wday].splice(index, 1);
								availableHours = { ...availableHours };
							}
						});
						daysOfWeek = getDatesFromTomorrow(7).filter((day: any) => availableHours[day.weekday]);
					} else {
						daysOfWeek = getDatesFromTomorrow(7);
					}
				}

				if (appointmentDate?.startTime) {
					selectedDay = daysOfWeek[new Date(appointmentDate.startTime).getDay() + 1].date;
					selectedWeekDay = daysOfWeek[new Date(appointmentDate.startTime).getDay() + 1].weekday;
				} else {
					selectedDay = daysOfWeek[0].date;
					selectedWeekDay = daysOfWeek[0].weekday;
				}
			} catch (error) {
				daysOfWeek = getDatesFromTomorrow(7);
				selectedDay = daysOfWeek[0].date;
				selectedWeekDay = daysOfWeek[0].weekday;
				dataLoading.set(false);
			}
		}
	});

	onDestroy(() => {
		if (doctor && !doc && !dataUpdated) {
			if (availableHoursOrigin !== availableHours || accountActiveOrigin !== accountActive) {
				drAvlblHrs.set({ hours: availableHours, allowAll, accountActive });
			}
		} else {
			drAvlblHrs.set(null);
		}
	});

	let selectedTime: any = null;

	function selectTime(day: any, time: any, startDate?: any, endDate?: any) {
		const currentYear = new Date().getFullYear();
		const start = new Date(`${startDate} ${currentYear}`);
		const end = endDate
			? new Date(`${endDate} ${currentYear}`)
			: new Date(start.getTime() + 30 * 60000);
		selectedTime = { day, time, start, end };
		if (doctor) {
			selectedWeekDay = selectedWeekDay == 0 ? 7 : selectedWeekDay;
			if (availableHours[selectedWeekDay]) {
				const index = availableHours[selectedWeekDay].findIndex((item: any) => item == time);
				if (index !== -1) {
					availableHours[selectedWeekDay].splice(index, 1);
					availableHours = { ...availableHours };
				} else {
					availableHours[selectedWeekDay].push(time);
					availableHours = { ...availableHours };
				}
			} else {
				availableHours[selectedWeekDay] = [time];
				availableHours = { ...availableHours };
			}
		} else {
			selectedAppointmentDate.set(selectedTime);
			showDatePicker = false;
		}
		classChange.set($classChange + 1);
	}

	function checkActive(date: any) {
		if (doctor) return availableHours[selectedWeekDay]?.find((a: any) => a == date) ? true : false;
		return false;
	}

	async function updateData() {
		Object.keys(availableHours).forEach((key) => {
			availableHours[key].sort();
		});
		let data = {
			availableHours: allowAll ? '' : JSON.stringify(availableHours),
			disableAppointments: !accountActive
		};
		try {
			if ($session.user?.doctor) await putData('doctors', 'id', $session.user?.doctor, data);
			let doc = $doctors.find((d) => d.id == $session.user?.doctor);
			if (doc) {
				doctors.update((currentItems) =>
					currentItems.map((item) =>
						item.id === $session.user?.doctor
							? {
									...item,
									availableHours: allowAll ? '' : JSON.stringify(availableHours),
									disableAppointments: !accountActive
								}
							: item
					)
				);
			}
			dataUpdated = true;
			toast.push('Uğurlu!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(91 144 77)',
					'--toastBarBackground': '#1d5b3c'
				}
			});
		} catch {
			toast.push('Xəta!', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(176 24 24)',
					'--toastBarBackground': '#5b1010'
				}
			});
		}
	}

	export const monthNames = [
		'Yanvar',
		'Fevral',
		'Mart',
		'Aprel',
		'May',
		'Iyun',
		'Iyul',
		'Avqust',
		'Sentyabr',
		'Oktyabr',
		'Noyabr',
		'Dekabr'
	];
</script>

{#if doctor}
	<!-- DOC CONFIGURATION THINGS -->
	<div class="d-flex flex-column align-items-center">
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			class="d-flex w-100 gap-3 mb-3 justify-content-between cursor-pointer"
			style="max-width: 705px"
			on:click={() => {
				accountActive = !accountActive;
			}}
		>
			<span>Hesabını aktiv/deaktiv et </span>
			<label class="switch">
				<input
					type="checkbox"
					bind:checked={accountActive}
					on:click={() => {
						accountActive = !accountActive;
					}}
				/>
				<span class="slider round"></span>
			</label>
		</div>
		<span
			style="font-size: small; color: gray; width: 100%; max-width: 705px; margin-block: {$mobile
				? '-10px'
				: '-20px'} 15px"
		>
			(aktiv: yeni görüş qəbul edilir. deaktiv: yeni görüş qəbulu dayandırılır)
		</span>
	</div>
{/if}

<div
	class="container datePickerContainer"
	class:blur={doctor && !accountActive}
	style="position: relative;"
>
	<!-- DOC CONFIGURATION THINGS -->
	{#if doctor}
		<div class="d-flex w-100 justify-content-center">
			<div class="row w-100 justify-content-center" style="max-width: 705px;">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="d-flex w-100 gap-1 mb-3 p-0 justify-content-between cursor-pointer"
					style="max-width: 705px"
					on:click={() => {
						allowAll = !allowAll;
						availableHours = {};
					}}
				>
					<span>Bütün saatlarda görüş qəbul et</span>
					<label class="switch">
						<input
							type="checkbox"
							bind:checked={allowAll}
							on:click={() => {
								allowAll = !allowAll;
							}}
						/>
						<span class="slider round"></span>
					</label>
				</div>
			</div>
		</div>
	{/if}
	<!-- DAYS SELECTOR -->
	<div class="row" style="position: sticky; top: .5rem; border-bottom: 1px solid #ececec">
		<div class="col">
			<div
				class="d-flex pb-2 px-1 gap-2 dateSelector"
				class:mh-105={daysOfWeek.length < 5}
				style={doctor ? 'max-width:705px; margin-inline:auto' : ''}
			>
				{#each daysOfWeek as { day, date, weekday }}
					<button
						class="btn btn-outline-primary d-flex flex-column h-100 align-items-center justify-content-center flex-1"
						style="min-height: 75px;"
						class:active={selectedDay == date}
						on:click={() => {
							selectedDay = date;
							selectedWeekDay = weekday == 0 ? 7 : weekday;
							classChange.set($classChange + 1);
						}}
					>
						<span style={doctor ? '' : 'font-size: small'}
							>{doctor ? (weekday == 0 ? '7. ' : weekday + '. ') : ''}{day}</span
						>
						{#if date && !doctor}
							<span style="font-weight: 500;">
								{#if date}
									{@const parsedDate = new Date(
										new Date().getFullYear(),
										new Date(date).getMonth(),
										new Date(date).getDate()
									)}
									{parsedDate.getDate()}
									{monthNames[parsedDate.getMonth()].slice(0, 3)}
								{/if}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
	<!-- HOURS SELECTOR -->
	<div class="row">
		<div class="col d-flex justify-content-center">
			<div
				class="d-flex flex-wrap gap-3 pb-2 pt-4 px-1 justify-content-between timeSelector"
				style="max-width: 705px; overflow-y: scroll; max-height: {pageHeight
					? `${parseInt(pageHeight) - 450}px`
					: `calc(100dvh - 450px)`}; min-height: 70px;"
			>
				{#if availableHours && Object.keys(availableHours).length !== 0 && !doctor && doc}
					{#each availableHours[selectedWeekDay] || [] as hour}
						<button
							class="btn btn-outline-primary flex-1 btnDay align-items-center"
							class:active={checkActive(`${selectedDay} ${hour}`)}
							style="max-width: 102px;"
							on:click={(e) => {
								const target = e.currentTarget;
								target.classList.toggle('active');
								selectTime(
									`${selectedDay} - ${hour}`,
									`${hour.toString().padStart(2, '0')}`,
									`${selectedDay} ${hour}`
								);
								allowAll = false;
							}}
						>
							{hour.toString().padStart(2, '0')}
						</button>
					{/each}
				{:else}
					{#each Array.from({ length: 15 }, (_, i) => i + 9) as hour}
						{#each [0, 30] as minute}
							{#if !(hour === 18 && minute === 30)}
								<button
									class="btn btn-outline-primary flex-1 btnDay align-items-center"
									class:active={checkActive(
										`${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`
									) ||
										allowAll ||
										$classChange == 0}
									style="max-width: 102px;"
									on:click={(e) => {
										// const target = e.currentTarget;
										// target.classList.toggle('active');
										selectTime(
											`${selectedDay} - ${hour}:${minute}`,
											`${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`,
											`${selectedDay} ${hour}:${minute}`
										);
										allowAll = false;
									}}
								>
									{hour.toString().padStart(2, '0')}:{minute === 0 ? '00' : '30'}
								</button>
							{/if}
						{/each}
					{/each}
				{/if}
			</div>
		</div>
	</div>
	{#if doctor && !accountActive && editHours}
		<div
			class="overlay"
			style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
		></div>
	{/if}
</div>

{#if doctor}
	<div class="d-flex justify-content-center w-100">
		<button
			class="btn btn-primary w-100 mt-3"
			style="max-width: 705px; position: relative; background: #980202!important"
			on:click={updateData}
			disabled={$dataLoading}
		>
			{$_('actions.save')}
			{#if $dataLoading}
				<div class="loader"></div>
			{/if}
		</button>
	</div>
{/if}

<style>
	.dateSelector {
		padding-top: 3px;
		padding-bottom: 1rem !important;
		flex-direction: column;
		max-height: 190px;
		overflow-x: scroll;
		flex-wrap: wrap;
		gap: 1rem !important;
	}
	.dateSelector .btn:not(:hover),
	.timeSelector .btn:not(:hover) {
		min-width: 90px;
		background-color: white;
	}
	.dateSelector .active {
		background-color: var(--primaryColor) !important;
		color: white;
		border-radius: 6px !important;
	}
	.datePickerContainer .btn:hover {
		min-width: 90px !important;
	}
	.dateSelector::-webkit-scrollbar {
		display: none;
	}
	.mh-105 {
		max-height: 105px !important;
	}
	@media screen and (min-width: 992px) {
		.datePickerContainer {
			min-width: min(705px, 90dvw);
		}
	}
	@media screen and (max-width: 992px) {
		.btnDay:active {
			background-color: white !important;
			color: var(--primaryColor) !important;
		}
		.btnDay:hover {
			background-color: unset !important;
			color: unset !important;
		}
	}
	@media screen and (max-width: 366px) {
		.btnDay {
			min-width: 70px !important;
		}
	}

	.btnDay.active {
		background-color: var(--primaryColor) !important;
		border-radius: 6px !important;
	}
	.blur {
		filter: opacity(0.7);
		cursor: auto;
	}
</style>
