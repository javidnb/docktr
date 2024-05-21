<script lang="ts">
	import { selectedAppointmentDate } from '$lib/store/dataStore';
	export let showDatePicker: boolean = false;
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
	<div class="row">
		<div class="col">
			<div class="d-flex gap-2 px-3 pb-3" style="overflow: scroll; max-height: 300px">
				{#each daysOfWeek as { day, date }}
					<div class="d-flex flex-column" style="max-width: 80px;">
						<div
							class="d-flex flex-column align-items-center mb-2"
							style="position: sticky;
                            top: 0; background: white; font-size: small"
						>
							<span>{day}</span>
							<span>{date}</span>
						</div>
						<div>
							<div class="d-flex flex-column row-gap-2 pb-2">
								{#each Array.from({ length: 10 }, (_, i) => i + 9) as hour}
									{#each [0, 30] as minute}
										{#if !(hour === 18 && minute === 30)}
											<button
												class="btn btn-outline-primary"
												on:click={() =>
													selectTime(
														`${day} - ${date}`,
														`${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`,
														`${date} ${hour}:${minute}`
													)}
											>
												{hour.toString().padStart(2, '0')}:{minute === 0 ? '00' : '30'}
											</button>
										{/if}
									{/each}
								{/each}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
