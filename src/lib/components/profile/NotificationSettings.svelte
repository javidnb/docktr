<script lang="ts">
	import { session } from '$lib/session';
	import { onMount } from 'svelte';
	import Select from 'svelte-select';
	import { _ } from 'svelte-i18n';
	import { parsePhoneNumber } from 'libphonenumber-js';

	let userData = $session.user;

	let whatsappNumber: any = userData?.whatsapp
		? parsePhoneNumber(userData.whatsapp).formatNational().slice(1)
		: null;
	let whatsappNotifications = whatsappNumber ? true : false;
	let inAppNotifications = userData?.inAppNotifs ? true : false;
	let emailNotifs = userData?.emailNotifs;
	let email = emailNotifs?.length ? true : false;

	onMount(() => {
		console.log($session);
	});

	let selectItems = [
		{ value: '+994', label: '+994' },
		{ value: '+90', label: '+90' }
	];

	let selecedItem = selectItems[0];
	let dataLoading: boolean = false;

	function handleWPInput(event: Event) {
		const target = event.target as HTMLInputElement;
		target.value = target.value.replace(/[^0-9]/g, '');
		if (target.classList?.contains('whatsapp')) {
			whatsappNumber = target.value;
		}

		if (whatsappNotifications && whatsappNumber && whatsappNumber.length > 3) {
			const country = selecedItem.value == '+994' ? 'AZ' : 'TR';
			let num = parsePhoneNumber(whatsappNumber, country);
			if (num.isValid()) {
				whatsappNumber = num.formatNational().slice(1);
			}
		}
	}
</script>

<div
	class="d-flex align-items-center justify-content-between"
	style="padding: 5px 0px 0px 0px!important"
>
	<span>Proqram daxili bildirişlər</span>
	<label class="switch">
		<input type="checkbox" bind:checked={inAppNotifications} />
		<span class="slider round"></span>
	</label>
</div>

<div
	class="d-flex align-items-center justify-content-between mt-2"
	style="padding: 5px 0px 0px 0px!important"
>
	<span>WhatsApp ilə bildiriş al</span>
	<label class="switch">
		<input
			type="checkbox"
			bind:checked={whatsappNotifications}
			on:click={() => {
				if (!whatsappNumber && userData?.phoneNumber) {
					whatsappNumber = parsePhoneNumber(userData?.phoneNumber).formatNational().slice(1);
				}
			}}
		/>
		<span class="slider round"></span>
	</label>
</div>

{#if whatsappNotifications}
	<div class="p-0 input-group mt-3">
		<Select
			class="form-control"
			items={selectItems}
			--width="80px"
			--border-top-left-radius="10px"
			--border-focused="1px solid var(--primaryColor)"
			--item-is-active-bg="var(--primaryColor)"
			--item-hover-bg="#d9e1d7"
			bind:value={selecedItem}
			clearable={false}
		></Select>
		<div class="form-floating p-0">
			<input
				class="form-control whatsapp"
				style="margin-left: -5px"
				bind:value={whatsappNumber}
				type="text"
				placeholder={$_('login.mobile')}
				required
				id="wpInput"
				on:input={handleWPInput}
			/>
			<label for="wpInput" style="color: gray">WhatsApp No</label>
		</div>
	</div>
{/if}

<div
	class="d-flex align-items-center justify-content-between mt-2"
	style="padding: 5px 0px 0px 0px!important"
>
	<span>Email ilə bildiriş al</span>
	<label class="switch">
		<input
			type="checkbox"
			bind:checked={email}
			on:click={() => {
				if (!emailNotifs && userData?.email) {
					emailNotifs = userData.email;
				}
			}}
		/>
		<span class="slider round"></span>
	</label>
</div>

{#if email}
	<div class="form-floating p-0 mt-2">
		<input
			class="form-control whatsapp"
			style="margin-left: -5px"
			bind:value={emailNotifs}
			type="text"
			placeholder={$_('login.mobile')}
			required
			id="emailInput"
		/>
		<label for="emailInput" style="color: gray">Email</label>
	</div>
{/if}

<button
	class="btn btn-primary mt-3 btnLoader w-100"
	on:click={() => {
		dataLoading = true;
	}}
    disabled={dataLoading}
>
	<span>{$_('actions.update')}</span>
	{#if dataLoading}
		<div class="loader"></div>
	{/if}
</button>

<style>
	/* Chechbox */
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 28px;
	}

	.switch input {
		opacity: 0;
		width: 0;
		height: 0;
	}

	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	.slider:before {
		position: absolute;
		content: '';
		height: 22px;
		width: 26px;
		left: 4px;
		bottom: 3px;
		background-color: white;
		-webkit-transition: 0.4s;
		transition: 0.4s;
	}

	input:checked + .slider {
		background-color: var(--primaryColor);
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
