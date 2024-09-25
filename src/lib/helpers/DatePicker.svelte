<script lang="ts">
	import { session } from '$lib/session';
	import { dataLoading, doctors, putData, selectedAppointmentDate } from '$lib/store/dataStore';
	import { onMount } from 'svelte';
	import { jsDateToSQL } from './dateFormatter';
	import { _ } from 'svelte-i18n';
	import { toast } from '@zerodevx/svelte-toast';

	export let showDatePicker: boolean = false;
	export let selectedDay: any = null;

	let daysOfWeek: any = [];
	let availableHours: any = [];

	let doctor: boolean = false;
	let accountActive: boolean = false;
	let allowAll: boolean = false;

	function getDatesFromTomorrow(numDays: any) {
		const daysOfWeek = [];
		let currentDate = new Date();
		for (let i = 0; i < numDays; i++) {
			currentDate.setDate(currentDate.getDate() + 1);
			const day = getAzerbaijaniDay(currentDate.getDay());
			const date = formatDate(currentDate);
			daysOfWeek.push({ day, date });
		}
		return daysOfWeek;
	}

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
			daysOfWeek.push({ day, date: formattedDate });
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

	onMount(() => {
		if ($session.user && $session.user.doctor) {
			doctor = true;
			let doc = $doctors.find((d) => d.id == $session.user?.doctor);
			if (doc && doc.availableHours) {
				availableHours = JSON.parse(doc.availableHours);
			} else {
				allowAll = true;
			}
			if (doc && doc.disableAppointments) {
				accountActive = doc.disableAppointments == true ? false : true;
			} else {
				accountActive = true;
			}
		}
		if (doctor) {
			daysOfWeek = getWeekDays();
			selectedDay = daysOfWeek[0].date;
		} else {
			daysOfWeek = getDatesFromTomorrow(7);
			selectedDay = daysOfWeek[0].date;
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
			const index = availableHours.findIndex(
				(item: any) => new Date(item).getTime() === new Date(selectedTime.start).getTime()
			);
			if (index !== -1) {
				availableHours.splice(index, 1);
			} else {
				availableHours.push(jsDateToSQL(selectedTime.start));
			}
		} else {
			selectedAppointmentDate.set(selectedTime);
			showDatePicker = false;
		}
	}

	function checkActive(date: any) {
		if (
			availableHours.find(
				(h: any) =>
					new Date(h).getTime() === new Date(`${date} ${new Date().getFullYear()}`).getTime()
			)
		) {
			return true;
		} else {
			return false;
		}
	}

	async function updateData() {
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
			style="font-size: small; color: gray; width: 100%; max-width: 705px; margin-block: -20px 15px"
		>
			(aktiv: yeni randevu qəbul edilir. deaktiv: randevu qəbulu dayandırılır)
		</span>
	</div>
{/if}

<div class="container datePickerContainer" class:blur={!accountActive} style="position: relative;">
	{#if doctor}
		<div class="row justify-content-center">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				class="d-flex w-100 gap-3 mb-3 p-0 justify-content-between cursor-pointer"
				style="max-width: 705px"
				on:click={() => {
					allowAll = !allowAll;
				}}
			>
				<span>Bütün saatlarda randevu qəbul et</span>
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
	{/if}
	<div class="row" style="position: sticky; top: .5rem; border-bottom: 1px solid #ececec">
		<div class="col">
			<div
				class="d-flex pb-2 px-1 gap-2 dateSelector"
				style={doctor ? 'max-width:705px; margin-inline:auto' : ''}
			>
				{#each daysOfWeek as { day, date }}
					<button
						class="btn btn-outline-primary d-flex flex-column h-100 align-items-center justify-content-center flex-1"
						style="min-height: 75px;"
						class:active={selectedDay == date}
						on:click={() => {
							selectedDay = date;
						}}
					>
						<span style={doctor ? '' : 'font-size: small'}>{day}</span>
						{#if date && !doctor}
							{@const [dayNum, monthName] = date.split(' ')}
							{@const monthIndex = monthNames.findIndex((m) => m.slice(0, 3) === monthName)}
							{@const year = new Date().getFullYear()}
							{@const validDate = new Date(year, monthIndex, parseInt(dayNum))}
							<span style="font-weight: 500;">
								{validDate.getDate()}
								{monthNames[validDate.getMonth()].slice(0, 3)}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col d-flex justify-content-center">
			<div
				class="d-flex flex-wrap gap-3 pb-2 pt-4 px-1 justify-content-between timeSelector"
				style="max-width: 705px; overflow-y: scroll; {doctor
					? ''
					: 'max-height: calc(100dvh - 430px);'}"
			>
				{#each Array.from({ length: 10 }, (_, i) => i + 9) as hour}
					{#each [0, 30] as minute}
						{#if !(hour === 18 && minute === 30)}
							<button
								class="btn btn-outline-primary flex-1 btnDay"
								class:active={checkActive(`${selectedDay} ${hour}:${minute}`)}
								style="max-width: 80px;"
								on:click={(e) => {
									const target = e.currentTarget;
									target.classList.toggle('active');
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
			</div>
		</div>
	</div>
	{#if !accountActive}
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
			style="max-width: 705px; position: relative"
			on:click={updateData}
			disabled={$dataLoading}
		>
			{$_('actions.update')}
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
	.btnDay.active {
		background-color: var(--primaryColor) !important;
	}
	.blur {
		filter: opacity(0.7);
		cursor: auto;
	}
</style>
