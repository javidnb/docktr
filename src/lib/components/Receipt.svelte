<script lang="ts">
	import { db } from '$lib/firebase.client';
	import { formatDate } from '$lib/helpers/dateFormatter';
	import { session } from '$lib/session';
	import { dataLoading, doctors, selectedUser } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';
	import { addDoc, collection } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let receiptType: string | null = 'lab';
	export let receiptData: any = null;
	export let showModal = true;
	let doctor = $doctors.find((u: any) => u.uid == $session.user?.uid);
	let doctorName = receiptData
		? $doctors.find((u: any) => u.uid == receiptData.fromUser)?.name
		: null;

	let inputs: string[] = [''];
	const messagesCollection = collection(db, 'messages');

	onMount(() => {
		if (receiptData) {
			console.log(receiptData);
			console.log(doctorName);
			inputs = receiptData.file.data;
		}
	});

	async function sendData() {
		dataLoading.set(true);
		try {
			await addDoc(messagesCollection, {
				fromUser: $session.user?.uid,
				toUser: $selectedUser,
				message: '',
				participants: [$session.user?.uid, $selectedUser].sort(),
				timestamp: new Date(),
				file: { type: receiptType, data: inputs.filter((input) => input.trim() !== '') }
			});
			dataLoading.set(false);
			showModal = false;
		} catch {
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

		// sendNotification(
		// 	userId,
		// 	$doctors.find((u: any) => u.uid == $session.user?.uid)
		// 		? $doctors.find((u: any) => u.uid == $session.user?.uid)?.name
		// 		: $session.user?.displayName || 'Yeni mesaj',
		// 	msg,
		// 	'https://sehiyye.net/messages'
		// );
	}

	function handleInputChange(index: number, event: Event) {
		const inputElement = event.target as HTMLInputElement;
		const value = inputElement.value;

		inputs[index] = value;
		if (index === inputs.length - 1 && value.trim() !== '') {
			inputs.push(''); // Add a new empty input
		}
	}
</script>

<div class="p-3 pb-4">
	<div class="container">
		<div class="row">
			<h5 class="text-center">{receiptType == 'lab' ? 'Analiz Tələb Formu' : 'Resept Formu'}</h5>
		</div>
		<div class="row py-2" style="border-block: 1px solid #ececec;">
			<div class="col">{doctorName ? doctorName : doctor?.name}</div>
			<div class="col">
				<span class="no-wrap text-end w-100 d-inline-block">{formatDate(new Date())}</span>
			</div>
		</div>
		<div class="row">
			<div class="col">
				<ul class="list-group" style="margin-block: 1.5rem;">
					{#each inputs as input, index}
						<li class="mt-2 list-group-item">
							<div class="input-group">
								<span
									class="input-group-text"
									style="min-width: 45px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        padding: 0;"
								>
									{index + 1}
								</span>
								<input
									class="form-control"
									type="text"
									disabled={receiptData}
									bind:value={input}
									on:input={(e) => handleInputChange(index, e)}
								/>
							</div>
						</li>
					{/each}
				</ul>
			</div>
		</div>
		<div class="row" class:d-none={receiptData}>
			<div class="col">
				<button class="btn btn-primary w-100" on:click={sendData} disabled={$dataLoading}>
					<span>{$_('actions.send')}</span>
					{#if $dataLoading}
						<div class="loader"></div>
					{/if}
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.list-group-item {
		padding: 0;
		border: none;
	}
</style>
