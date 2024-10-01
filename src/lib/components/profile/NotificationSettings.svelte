<script lang="ts">
	import { session } from '$lib/session';
	import Select from 'svelte-select';
	import { _ } from 'svelte-i18n';
	import { parsePhoneNumber } from 'libphonenumber-js';
	import { putData, countryNos } from '$lib/store/dataStore';
	import { toast } from '@zerodevx/svelte-toast';

	let userData = $session.user;

	let whatsappNumber: any = userData?.whatsapp
		? parsePhoneNumber(userData.whatsapp).formatNational().slice(1)
		: null;
	let whatsappNotifications = whatsappNumber ? true : false;
	let inAppNotifs = userData?.inAppNotifs ? true : false;
	let emailNotifs = userData?.emailNotifs;
	let email = emailNotifs?.length ? true : false;
	let disabled = false;

	let selecedItem = countryNos[0];
	let dataLoading: boolean = false;

	async function updateData() {
		if (checkDisabled() == true) {
			toast.push('Məlumatlar düzgün daxil edilməyib', {
				duration: 2000,
				theme: {
					'--toastColor': 'mintcream',
					'--toastBackground': 'rgb(176 24 24)',
					'--toastBarBackground': '#5b1010'
				}
			});
		} else {
			dataLoading = true;
			let result;
			let updatedData = {
				inAppNotifs,
				whatsapp: whatsappNotifications
					? parsePhoneNumber(selecedItem.value + whatsappNumber).number
					: null,
				emailNotifs: email ? emailNotifs : null
			};

			// TODO BUNU NULL ELEYIREM AMMA DB`ya empty string dusur

			if (userData?.uid) {
				result = await putData('users', 'uid', userData?.uid, updatedData, true);
				if (result) {
					$session.user = { ...$session.user, ...updatedData };
					toast.push($_('actions.success'), {
						duration: 2000,
						theme: {
							'--toastColor': 'mintcream',
							'--toastBackground': 'rgb(91 144 77)',
							'--toastBarBackground': '#1d5b3c'
						}
					});
				}
				dataLoading = false;
			}
		}
	}

	function handleWPInput(event: Event) {
		const target = event.target as HTMLInputElement;
		target.value = target.value.replace(/[^0-9]/g, '');
		if (target.classList?.contains('whatsapp')) {
			whatsappNumber = target.value;
		}

		if (whatsappNotifications && whatsappNumber && whatsappNumber.length > 8) {
			let num = parsePhoneNumber(selecedItem.value+whatsappNumber);
			if (num.isValid()) {
				whatsappNumber = num.formatNational().slice(1);
				disabled = false;
			}
		}
	}

	function checkDisabled() {
		const emailValid =
			(email && emailNotifs && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNotifs)) || !email;
		const whatsappValid =
			whatsappNotifications && whatsappNumber && whatsappNumber.length > 8
				? parsePhoneNumber(selecedItem.value + whatsappNumber).isValid()
				: !whatsappNotifications;
		disabled = !(emailValid && whatsappValid);
		return disabled;
	}
</script>

<div class="d-flex justify-content-center w-100 p-0">
	<div style="max-width: 705px; width: 100%">
		<div
			class="d-flex align-items-center justify-content-between"
			style="padding: 5px 0px 0px 0px!important"
		>
			<span>Proqram daxili bildiriş al</span>
			<label class="switch">
				<input type="checkbox" bind:checked={inAppNotifs} />
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
						setTimeout(() => {
							if (whatsappNotifications) {
								disabled = true;
							} else {
								disabled = false;
							}
							if (!whatsappNumber && userData?.phoneNumber) {
								whatsappNumber = parsePhoneNumber(userData?.phoneNumber).formatNational().slice(1);
								disabled = false;
							}
							if (whatsappNumber) disabled = false;
						}, 5);
					}}
				/>
				<span class="slider round"></span>
			</label>
		</div>

		{#if whatsappNotifications}
			<div class="p-0 input-group mt-3">
				<Select
					class="form-control"
					items={countryNos}
					floatingConfig={{
						strategy: 'fixed'
					}}
					--width="80px"
					--border-top-left-radius="10px"
					--border-focused="1px solid var(--primaryColor)"
					--item-is-active-bg="var(--primaryColor)"
					--item-hover-bg="#d9e1d7"
					--list-z-index="9"
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
						maxlength="11"
					/>
					<label for="wpInput" style="color: gray">WhatsApp No</label>
				</div>
			</div>
		{/if}

		<div
			class="d-flex align-items-center justify-content-between mt-2"
			style="padding: 5px 0px 0px 0px!important; z-index:0"
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
						setTimeout(() => {
							checkDisabled();
						}, 5);
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
					on:input={() => {
						if (emailNotifs && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNotifs)) {
							disabled = false;
						} else {
							disabled = true;
						}
					}}
				/>
				<label for="emailInput" style="color: gray">Email</label>
			</div>
		{/if}

		<button
			class="btn btn-primary mt-3 btnLoader w-100"
			on:click={updateData}
			disabled={dataLoading || disabled}
		>
			<span>{$_('actions.update')}</span>
			{#if dataLoading}
				<div class="loader"></div>
			{/if}
		</button>
	</div>
</div>

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
