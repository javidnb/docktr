<script lang="ts">
	import { onMount } from 'svelte';
	import { session } from '$lib/session';
	import {
		appointments,
		dataLoading,
		doctors,
		loginModal,
		pageTitleElement,
		payments
	} from '$lib/store/dataStore';
	import { formatDate } from '$lib/helpers/dateFormatter';

	let pageHeight: any = null;

	// TODO FILTER ONLY ENDED APPOINTMENTS
	$: apps = groupByPaymentId($appointments);

	$: if (!$session.user) {
		loginModal.set(true);
	} else loginModal.set(false);

	$: if ($payments) {
		apps = groupByPaymentId($appointments);
	}

	onMount(async () => {
		console.log(apps);
		if (window.visualViewport) {
			pageHeight = window.visualViewport?.height;
			window.visualViewport.addEventListener('resize', () => {
				pageHeight = window.visualViewport?.height;
			});
		}
		if ($session.user?.doctor) {
			try {
				let time = new Date().getTime();
				const response = await fetch(
					`https://tekoplast.az/docktr/api/?payments&uid=${$session.user.doctor}&t=${time}`
				);
				let result = await response.json();
				payments.set(result);
			} catch (error) {
				return;
			}
		}
	});

	function groupByPaymentId(data: any[]): {
		[key: string]: { sum: number; data: any[]; payment?: any };
	} {
		const result = data.reduce(
			(acc: { [key: string]: { sum: number; data: any[]; payment?: any } }, item: any) => {
				const key =
					item.paymentId === 0 || item.paymentId === null ? '0' : item.paymentId.toString();

				if (!acc[key]) {
					acc[key] = { sum: 0, data: [] };
				}

				const amount = item.amount || 0;
				const comission = item.comission || 0;
				const calculatedValue = amount - comission;

				acc[key].sum += calculatedValue;
				acc[key].data.push(item);

				// Fetch the entire payment data based on paymentId from $payments store
				if (key !== '0') {
					const payment = $payments.find((p: any) => p.id === parseInt(key));
					acc[key].payment = payment || null;
				}

				return acc;
			},
			{}
		);

		// Ensure the "0" key (no payment) is at the start
		const reorderedResult: { [key: string]: { sum: number; data: any[]; payment?: any } } = {};

		if (result['0']) {
			reorderedResult['0'] = result['0'];
		}

		Object.keys(result).forEach((key) => {
			if (key !== '0') {
				reorderedResult[key] = result[key];
			}
		});

		return reorderedResult;
	}
</script>

<!-- <section>
	<h5>Hastalık Geçmişi</h5>
	<button class="btn btn-primary w-50" class:d-none={hideBtn} on:click={registerCM}
		>push token</button
	>
	<input class="form-control mt-3 w-50" type="text" bind:value={inputToken} />

	{#if Notification.permission !== 'granted'}
		<button
			class="btn btn-primary w-50 mt-3"
			class:d-none={hideBtn}
			on:click={requestNotificationPermission}>Notification Perm</button
		>
	{/if}

	<button class="btn btn-primary w-50 mt-3" on:click={sendMsg}>send notification</button>
</section> -->

<section
	class="pb-3"
	style="{pageHeight && $pageTitleElement.offsetHeight
		? `max-height: ${pageHeight - $pageTitleElement.offsetHeight - 30}px`
		: ''}; overflow-y: scroll "
>
	<div class="d-flex flex-column gap-3">
		{#if Object.entries(apps).length}
			{#each Object.entries(apps) as [paymentId, appoinmentss]}
				<div class="card row-gap-2 p-2">
					<div
						class="d-flex w-100 ps-3 py-2 gap-2 align-items-center"
						style="background: #ececec;
    						border-radius: 12px;"
					>
						<span class="textBox">{(appoinmentss.sum / 1.7).toFixed(2)} USD</span>
						{#if appoinmentss.payment}
							<span class="textBox">{formatDate(new Date(appoinmentss.payment.date))}</span>
							<div class="ms-auto me-3">
								<a
									href={appoinmentss.payment.receipt}
									target="_blank"
									class="btn btn-primary card p-2 cursor-pointer flex-row gap-2 justify-content-center align-items-center"
									style="min-width: 150px; border-radius: 12px"
								>
									<span class="material-symbols-outlined"> download </span>
									<span>Endir</span>
								</a>
							</div>
						{/if}
					</div>
					{#each appoinmentss.data as appointment}
						<div
							class="card py-2 px-3 d-flex flex-row gap-3"
							style="background-color: white; box-shadow: 0px 0px 5px #00000012"
						>
							<div class="d-flex align-items-center">
								{#if appointment.photoURL}
									<img
										src={appointment.photoURL}
										style="max-height: 60px; aspect-ratio: 1/1; object-fit: cover; object-position: center; max-width: 120px; border-radius: 100%; object-fit: cover"
										alt="user pic"
									/>
								{:else}
									<div
										style="width: 60px; height: 60px; color: var(--primaryText); border-radius: 100%; border: 3px solid var(--primaryColor); display: flex; align-items: center; justify-content: center;"
									>
										<span class="material-symbols-outlined icon-fill" style="font-size: 3rem"
											>person</span
										>
									</div>
								{/if}
							</div>
							<div class="d-flex flex-column justify-content-center">
								<span
									style="font-size: 1.2rem;
								text-decoration: none;
								color: #37592e;
								font-weight: 500;"
								>
									{appointment.displayName}
								</span>
								<span>{formatDate(new Date(appointment.startTime))}</span>
								{#if appointment.amount}
									<span>{((appointment.amount - appointment.comission) / 1.7).toFixed(2)} USD</span>
								{/if}
							</div>
							<div
								class="d-flex align-items-center ms-auto"
								style="color: {appointment.paymentId ? 'var(--primaryColor)' : 'rgb(199 215 108)'}"
							>
								<span class="material-symbols-outlined icon-fill">
									{appointment.paymentId ? 'check_circle' : 'pending'}
								</span>
							</div>
						</div>
					{/each}
				</div>
			{/each}
		{:else}
			<div class="py-2">
				<span>Ödəniş tarixçəsi boşdur</span>
			</div>
		{/if}
	</div>
</section>

<style>
	.textBox {
		background-color: white;
		border-radius: 12px;
		padding: .5rem 1rem;
	}
</style>