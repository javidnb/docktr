<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DailyIframe from '@daily-co/daily-js';
	import type { DailyCall } from '@daily-co/daily-js';
	import daily from '@daily-co/daily-js';
	import {
		dataLoading,
		putData,
		joinVideoCall,
		ongoingAppointment,
		sendNotification,
		hideNav,
		selectedUser
	} from '$lib/store/dataStore';
	import { session } from '$lib/session';
	import { _ } from 'svelte-i18n';
	import { browser } from '$app/environment';
	import Confirm from '$lib/helpers/Confirm.svelte';
	import { toast } from '@zerodevx/svelte-toast';
	import Documents from './profile/Documents.svelte';
	import DocumentsByUser from './DocumentsByUser.svelte';

	export let appointmentId: number;
	let callFrame: DailyCall | any = null;
	let callObject: any;
	let localVideoRef: any = null;
	let remoteVideoRef: any = null;
	let camOn: any = true;
	let micOn: any = true;
	let roomUrl: string = 'https://sehiyye.daily.co/';
	let API_KEY = import.meta.env.VITE_DAILY_API_KEY;
	let DAILY_API_URL = 'https://api.daily.co/v1/';
	let stream: any;
	let endCallModal: boolean = false;

	onMount(() => {
		getRoom();
		setLocalDevices();
	});

	onDestroy(() => {
		if (callFrame) {
			callFrame.leave();
			callFrame.destroy();
		}
		if (!browser) return;
		dataLoading.set(false);
	});

	async function getRoom() {
		try {
			stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
			localVideoRef!.srcObject = stream;
			let time = new Date().getTime();
			let response;
			response = await fetch(
				`https://tekoplast.az/docktr/api/?appointment&id=${appointmentId}&t=${time}`
			);

			const result = await response.json();

			if (result?.roomId) {
				let dre = await fetch(`https://api.daily.co/v1/rooms/${result.roomId}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${API_KEY}`,
						'Content-Type': 'application/json'
					}
				});

				const dailyRoomExits = await dre.json();

				if (dailyRoomExits?.id) {
					roomUrl += result.roomId;
					videoChat();
				} else {
					createRoom();
				}
			} else {
				createRoom();
			}
			return result;
		} catch (error) {
			console.error(error);
			dataLoading.set(false);
			return null;
		}
	}

	export async function createRoom() {
		const roomConfig = {
			properties: {
				exp: Math.floor(Date.now() / 1000) + 3600,
				max_participants: 2,
				enable_screenshare: false
			}
		};

		try {
			const response = await fetch(DAILY_API_URL + 'rooms', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(roomConfig)
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.statusText}`);
				dataLoading.set(false);
			}

			const data = await response.json();
			console.log('data: ', data);
			roomUrl += data.name;
			await putData('appointments', 'id', appointmentId, { roomId: data.name });
			// roomName.set(data.name);
			// roomUrl.set(data.url);
		} catch (err) {
			console.log(err);
			dataLoading.set(false);
		} finally {
			// isLoading.set(false);
			// launchVideoChatUI();
			videoChat();
			dataLoading.set(false);
		}
	}

	// function launchVideoChatUI() {
	// 	callFrame = DailyIframe.createFrame(videoContainer, {
	// 		showLeaveButton: false,
	// 		showUserNameChangeUI: false,
	// 		showFullscreenButton: true,
	// 		iframeStyle: {
	// 			position: 'absolute',
	// 			width: '100vw',
	// 			height: 'calc(100dvh + 30px)',
	// 			border: 'none',
	// 			top: '-31px',
	// 			left: '0px',
	// 			zIndex: '99'
	// 		}
	// 	});

	// 	callFrame.join({ url: roomUrl, videoSource: true, audioSource: true }).then(() => {
	// 		// SET USERNAME
	// 		if (callFrame && $session.user?.displayName) {
	// 			callFrame?.setUserName($session.user?.displayName);
	// 		}
	// 		// showBtnEndCall.set(true);
	// 		joinVideoCall.set(true);
	// 		dataLoading.set(false);
	// 		if (!callFrame) return;

	// 		callFrame?.updateCustomTrayButtons({
	// 			btnLeave: {
	// 				iconPath: 'https://sehiyye.online/uploads/4b9971e19fc01e7804afeb41061f7ba0.png',
	// 				iconPathDarkMode: 'https://sehiyye.online/uploads/4b9971e19fc01e7804afeb41061f7ba0.png',
	// 				label: $_('actions.leave'),
	// 				tooltip: $_('actions.leave_call')
	// 			}
	// 		});

	// 		if (callFrame.participantCounts().present != 2) {
	// 			if ($session.user?.uid == $ongoingAppointment.userId) {
	// 				sendNotification(
	// 					$ongoingAppointment.doctorId,
	// 					true,
	// 					'Pls Join Video Call',
	// 					'Click to join',
	// 					'https://sehiyye.online/appointment'
	// 				);
	// 			} else {
	// 				sendNotification(
	// 					$ongoingAppointment.userId,
	// 					false,
	// 					'Pls Join Video Call',
	// 					'Click to join',
	// 					'https://sehiyye.online/appointment'
	// 				);
	// 			}
	// 		}
	// 	});

	// 	callFrame?.on('custom-button-click', (ev) => {
	// 		const buttonID = ev.button_id;
	// 		if (buttonID !== 'btnLeave') return;
	// 		callFrame?.leave();
	// 		callFrame?.destroy();
	// 	});

	// 	callFrame.on('left-meeting', async (event) => {
	// 		joinVideoCall.set(false);
	// 		ongoingAppointment.set(false);
	// 		let session = callFrame?.meetingSessionSummary();

	// 		const headers = new Headers({
	// 			Authorization: `Bearer ${API_KEY}`,
	// 			'Content-Type': 'application/json'
	// 		});

	// 		fetch(`${DAILY_API_URL}/meetings/${session?.id}`, {
	// 			method: 'GET',
	// 			headers: headers
	// 		})
	// 			.then((response) => response.json())
	// 			.then((data) => {
	// 				console.log('Session Details:', data);
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error fetching session details:', error);
	// 			});
	// 	});

	// 	return () => {
	// 		if (callFrame) {
	// 			callFrame.leave();
	// 			callFrame.destroy();
	// 		}
	// 	};
	// }

	async function videoChat() {
		if ($joinVideoCall) {
			callObject = daily.createCallObject({
				url: roomUrl,
				userName: $session.user?.displayName || ''
			});

			callObject!.setInputDevicesAsync({
				videoDeviceId: stream.getVideoTracks()[0].getSettings().deviceId
			});

			callObject.on('left-meeting', async () => {
				joinVideoCall.set(false);
				ongoingAppointment.set(false);
				let session = callObject?.meetingSessionSummary();

				const headers = new Headers({
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json'
				});

				fetch(`${DAILY_API_URL}/meetings/${session?.id}`, {
					method: 'GET',
					headers: headers
				})
					.then((response) => response.json())
					.then((data) => {
						console.log('Session Details:', data);
					})
					.catch((error) => {
						console.error('Error fetching session details:', error);
					});
			});

			// callObject
			// 	.on('joining-meeting', updateParticpants)
			// 	.on('joined-meeting', handleJoinedMeeting)
			// 	.on('participant-joined', updateParticpants)
			// 	.on('participant-left', updateParticpants)
			// 	.on('participant-left', updateParticpants)
			// 	.on('participant-updated', updateParticpants)
			// 	.on('error', handleError)
			// 	// camera-error = device error, like device in use or permissions issues
			// 	.on('camera-error', handleDeviceError)
			// 	.on('app-message', handleAppMessage);

			callObject.on('participant-left', leaveCall);

			// Handle local participant stream
			callObject.on('participant-updated', (event: any) => {
				const videoTrack = event.participant.tracks.video?.track;

				if (event.participant.local && videoTrack) {
					localVideoRef!.srcObject = new MediaStream([videoTrack]);
					dataLoading.set(false);
				} else if (!event.participant.local && videoTrack) {
					remoteVideoRef!.srcObject = new MediaStream([videoTrack]);
				}
			});

			if (callObject.participantCounts().present != 2) {
				if ($session.user?.uid == $ongoingAppointment.userId) {
					console.log('sending notification');
					sendNotification(
						$ongoingAppointment.doctorId,
						true,
						'Pls Join Video Call',
						'Click to join',
						'https://sehiyye.online/appointment'
					);
				} else {
					sendNotification(
						$ongoingAppointment.userId,
						false,
						'Pls Join Video Call',
						'Click to join',
						'https://sehiyye.online/appointment'
					);
				}
			}

			// Join the call with the name set in the Home.vue form
			try {
				await callObject.join();
				// reset possible existing error message
				// dailyErrorMessage.set('');
			} catch (e) {
				// dailyErrorMessage.set(e);
			}
		}
	}

	async function leaveCall() {
		// Stop all video and audio tracks
		if (stream) {
			const tracks = stream.getTracks();
			tracks.forEach((track: any) => track.stop());
		}

		joinVideoCall.set(false);
		selectedUser.set(null);

		// Leave the Daily call and destroy the call object
		if (callObject) {
			await callObject.leave();
			await callObject.destroy();
		}

		// Reset relevant states
		hideNav.set(false);
		stream = null;

		// Clear video references to ensure they are reset
		if (localVideoRef) localVideoRef.srcObject = null;
		if (remoteVideoRef) remoteVideoRef.srcObject = null;

		toast.push($_('call.ended'), {
			duration: 2000,
			theme: {
				'--toastColor': 'mintcream',
				'--toastBackground': 'rgb(91 144 77)',
				'--toastBarBackground': '#1d5b3c'
			}
		});
	}

	const setLocalDevices = () => {
		console.log('setting devices');
		if (!callObject) return;
		camOn = callObject.localVideo();
		micOn = callObject.localAudio();
	};

	const toggleVideo = () => {
		if (!callObject) return;
		const currentVid = callObject.localVideo();
		camOn = !currentVid;
		callObject.setLocalVideo(!currentVid);
	};

	const toggleAudio = () => {
		if (!callObject) return;
		const currentAudio = callObject.localAudio();
		micOn = !currentAudio;
		callObject.setLocalAudio(!currentAudio);
	};

	async function cycleCamera() {
		if (callObject) {
			try {
				const cameraCycleResult = await callObject.cycleCamera();
				console.log('Camera switched:', cameraCycleResult);
			} catch (error) {
				console.error('Error switching camera:', error);
			}
		} else {
			console.warn('Daily call object is not initialized.');
		}
	}

	function switchMinimizedVideo() {
		if (remoteVideoRef.srcObject) {
			let local = localVideoRef.srcObject;
			localVideoRef.srcObject = remoteVideoRef.srcObject;
			remoteVideoRef.srcObject = local;
		}
	}
</script>

<!-- <div class="video-container" bind:this={videoContainer}></div> -->

<div
	style="position: absolute; top: 0px; left: 0; width: 100%; z-index: 9999"
	class:d-none={!localVideoRef?.srcObject}
>
	<!-- <h3>Local Video</h3> -->
	<div
		class="d-flex jusify-content-center align-items-center"
		style="height: 100dvh;
			width: 100%;
			justify-content: center;
			background: rgb(55 58 55);"
	>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			bind:this={localVideoRef}
			autoplay
			playsinline
			class:minimize={remoteVideoRef?.srcObject}
			class="transition responsiveVideo"
			on:click={switchMinimizedVideo}
		></video>
		<!-- svelte-ignore a11y-media-has-caption -->
		<video
			style="height: 100%; max-width: 100%"
			bind:this={remoteVideoRef}
			autoplay
			playsinline
			class:d-none={!remoteVideoRef?.srcObject}
		></video>

		{#if localVideoRef?.srcObject}
			{#if !remoteVideoRef?.srcObject}
				<div
					class="d-flex align-items-center justify-content-center"
					style="
						background: rgba(0, 0, 0, 0.37);
						padding: 0.5rem 2rem;
						border-radius: 20px;
						position: absolute;
						bottom: 6rem;
						left: 50%;
						transform: translateX(-50%);
						color: #ffffffc2; font-size: small;
						white-space: nowrap"
				>
					Zəhmət olmasa gözləyin
				</div>
			{/if}
			<div class="videoControlContainer d-flex align-items-center gap-3 px-3">
				{#if $dataLoading}
					<div class="progress-bar">
						<div class="progress-animation"></div>
					</div>
				{/if}
				<button
					class="btn d-flex videoControlBtn"
					on:click={toggleAudio}
					class:red={!micOn}
					disabled={$dataLoading}
				>
					<span class="material-symbols-outlined icon-fill" style="font-size: 30px">
						{micOn ? 'mic' : 'mic_off'}
					</span>
				</button>
				<button
					class="btn d-flex videoControlBtn"
					on:click={toggleVideo}
					class:red={!camOn}
					disabled={$dataLoading}
				>
					<span class="material-symbols-outlined icon-fill" style="font-size: 30px">
						{camOn ? 'videocam' : 'videocam_off'}
					</span>
				</button>
				<button
					class="btn d-flex mx-auto videoControlBtn endCallBtn"
					on:click={() => {
						endCallModal = true;
					}}
					style="background: #a51f1f; color: white;"
				>
					<span class="material-symbols-outlined icon-fill" style="font-size: 30px">
						call_end
					</span>
				</button>
				<button
					class="btn d-flex videoControlBtn"
					disabled={$dataLoading}
					data-bs-toggle="collapse"
					data-bs-target="#endCall"
					aria-expanded="false"
					aria-controls="endCall"
				>
					<span class="material-symbols-outlined icon-fill" style="font-size: 30px">
						attach_file
					</span>
				</button>
				<button class="btn d-flex videoControlBtn" on:click={cycleCamera} disabled={$dataLoading}>
					<span class="material-symbols-outlined icon-fill" style="font-size: 30px">
						cameraswitch
					</span>
				</button>
			</div>
		{/if}

		<div
			class="collapse"
			id="endCall"
			style="position: absolute;
			bottom: 6rem;
			background: rgb(255 255 255 / 90%);
			border-radius: 14px;
			padding: 1rem;
			width: min(90dvw, 380px);
			max-height: min(70dvh, 450px); overflow-y: scroll; padding: 10px"
		>
			<DocumentsByUser userId={$selectedUser} newFile={true} />
		</div>
	</div>
</div>

{#if endCallModal}
	<Confirm
		message="{$_('call.end')}?"
		no={$_('call.no')}
		yes={$_('call.yes')}
		onConfirm={leaveCall}
		onCancel={() => {
			endCallModal = false;
		}}
	/>
{/if}

<style>
	.minimize {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		max-width: 30%;
		max-height: 300px !important;
		border-radius: 8px;
		z-index: 99;
		transition-duration: 0.4s;
	}
	.transition {
		transition-duration: 0.5s;
	}
	.videoControlContainer {
		border: 1px solid #ececec33;
		background: rgba(0, 0, 0, 0.368);
		padding-block: 0.5rem;
		border-radius: 20px;
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		width: min(90dvw, 380px);
	}
	.videoControlBtn {
		border-radius: 100%;
		background: rgb(0 0 0 / 33%);
		padding: 0.8rem;
		color: white;
		font-size: 20px;
		border: 1px solid #ececec33;
	}
	.videoControlBtn:hover {
		background: #ffffff12 !important;
	}
	.endCallBtn:hover {
		background-color: rgb(134 30 30) !important;
	}
	@media screen and (min-width: 992px) {
		.responsiveVideo {
			height: 100%;
		}
	}
	@media screen and (max-width: 992px) {
		.responsiveVideo {
			width: 100%;
		}
		.minimize {
			bottom: 6rem;
		}
	}
	.red {
		color: red !important;
	}
</style>
