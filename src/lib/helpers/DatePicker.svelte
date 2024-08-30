<script lang="ts">
	import { selectedAppointmentDate } from '$lib/store/dataStore';
	export let showDatePicker: boolean = false;
	export let selectedDay: any = null;
	// Function to get dates starting from tomorrow
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

	let daysOfWeek = getDatesFromTomorrow(7); // Get dates starting from tomorrow
	console.log(daysOfWeek);
	selectedDay = daysOfWeek[0].date;
	let selectedTime: any = null;

	function selectTime(day: any, time: any, startDate?: any, endDate?: any) {
		const currentYear = new Date().getFullYear();
		const start = new Date(`${startDate} ${currentYear}`);
		const end = endDate
			? new Date(`${endDate} ${currentYear}`)
			: new Date(start.getTime() + 30 * 60000);
		selectedTime = { day, time, start, end };
		selectedAppointmentDate.set(selectedTime);
		showDatePicker = false;
	}
</script>

<div class="container">
	<div
		class="row"
		style="position: sticky; background: white; top: .5rem; border-bottom: 1px solid #ececec"
	>
		<div class="col">
			<div
				class="d-flex pb-2 px-1 gap-2 dateSelector"
				style="overflow: scroll; max-height: 300px; padding-top:3px"
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
						<span style="font-size: small">{day}</span>
						<span style="font-weight: 500;">{date}</span>
					</button>
				{/each}
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col">
			<div
				class="d-flex flex-wrap gap-3 pb-2 pt-4 px-3 justify-content-center"
				style="max-width: 705px;"
			>
				{#each Array.from({ length: 10 }, (_, i) => i + 9) as hour}
					{#each [0, 30] as minute}
						{#if !(hour === 18 && minute === 30)}
							<button
								class="btn btn-outline-primary flex-1"
								style="max-width: 80px;"
								on:click={() => {
									selectTime(
										`${selectedDay} - ${hour}:${minute}`,
										`${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`,
										`${selectedDay} ${hour}:${minute}`
									);
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
</div>

<style>
	.dateSelector .btn {
		min-width: 90px;
	}
	.dateSelector .active {
		background-color: var(--primaryColor);
		color: white;
		border-radius: 6px !important;
	}
</style>
