<script lang="ts">
	import { updatePassword } from 'firebase/auth';
	import { auth } from '$lib/firebase.client';
	import { dataLoading, loginModal } from '$lib/store/dataStore';
	import { _ } from 'svelte-i18n';
	import { toast } from '@zerodevx/svelte-toast';

	let password: string | null = null;
	let repeatPassword: string | null = null;
	let type: string = 'password';

	async function updatePass() {
		dataLoading.set(true);
		try {
			if (auth.currentUser && password) await updatePassword(auth.currentUser, password);
		} catch {
			dataLoading.set(false);
		}
		dataLoading.set(false);
		toast.push($_('actions.success'), {
			duration: 2000,
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgb(91 144 77)',
				'--toastBarBackground': '#1d5b3c'
			}
		});
		loginModal.set(false);
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="form-floating p-0" style="z-index: 0; position: relative">
	{#if type == 'password'}
		<input
			class="form-control"
			bind:value={password}
			type="password"
			placeholder={$_('login.pass')}
			required
			id="passwInput"
		/>
	{:else}
		<input
			class="form-control"
			bind:value={password}
			type="text"
			placeholder={$_('login.pass')}
			required
			id="passwInput"
		/>
	{/if}
	<label for="passwInput" style="color: gray">{$_('login.pass')}</label>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span
		class="material-symbols-outlined"
		style="position: absolute; right: 10px; top: 17px; cursor: pointer"
		on:click={() => {
			if (type == 'password') {
				type = 'text';
			} else {
				type = 'password';
			}
		}}
	>
		{type == 'password' ? 'visibility' : 'visibility_off'}
	</span>
</div>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="form-floating p-0 mt-3" style="z-index: 0; position: relative">
	{#if type == 'password'}
		<input
			class="form-control"
			bind:value={repeatPassword}
			type="password"
			placeholder={$_('login.pass')}
			required
			id="passwInput"
		/>
	{:else}
		<input
			class="form-control"
			bind:value={repeatPassword}
			type="text"
			placeholder={$_('login.pass')}
			required
			id="passwInput"
		/>
	{/if}
	<label for="passwInput" style="color: gray">Şifrəni təkrarlayın</label>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<span
		class="material-symbols-outlined"
		on:click={() => {
			if (type == 'password') {
				type = 'text';
			} else {
				type = 'password';
			}
		}}
		style="position: absolute; right: 10px; top: 17px; cursor: pointer"
	>
		{type == 'password' ? 'visibility' : 'visibility_off'}
	</span>
</div>

<button
	class="btn btn-outline-primary mt-3 w-100"
	disabled={$dataLoading ||
		(password != null && password?.length < 6) ||
		password != repeatPassword}
	on:click={updatePass}
>
	{$_('actions.update')}
	{#if $dataLoading}
		<div class="loader"></div>
	{/if}
</button>
