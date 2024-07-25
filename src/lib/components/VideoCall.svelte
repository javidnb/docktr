<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DailyIframe from '@daily-co/daily-js';
	import type { DailyCall } from '@daily-co/daily-js';
	import {
		dataLoading,
		putData,
		joinVideoCall,
		ongoingAppointment,
		sendNotification
	} from '$lib/store/dataStore';
	import { session } from '$lib/session';
	import { _ } from 'svelte-i18n';

	export let appointmentId: number;
	let callFrame: DailyCall | null = null;
	let roomUrl: string = 'https://sehiyye.daily.co/';
	let videoContainer: HTMLDivElement;
	let API_KEY = import.meta.env.VITE_DAILY_API_KEY;
	let DAILY_API_URL = 'https://api.daily.co/v1/';

	onMount(() => {
		getRoom();
	});

	onDestroy(() => {
		if (callFrame) {
			callFrame.leave();
			callFrame.destroy();
		}
	});

	async function getRoom() {
		try {
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
					launchVideoChatUI();
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
				max_participants: 2
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
			}

			const data = await response.json();
			console.log('data: ', data);
			roomUrl += data.name;
			await putData('appointments', 'id', appointmentId, { roomId: data.name });
			// roomName.set(data.name);
			// roomUrl.set(data.url);
		} catch (err) {
			console.log(err);
		} finally {
			// isLoading.set(false);
			launchVideoChatUI();
		}
	}

	function launchVideoChatUI() {
		callFrame = DailyIframe.createFrame(videoContainer, {
			showLeaveButton: true,
			showFullscreenButton: true,
			iframeStyle: {
				position: 'absolute',
				width: '100vw',
				height: 'calc(100dvh + 30px)',
				border: 'none',
				top: '-31px',
				left: '0px',
				zIndex: '99'
			}
		});

		callFrame.join({ url: roomUrl, videoSource: true, audioSource: true }).then(() => {
			// SET USERNAME
			if (callFrame && $session.user?.displayName) {
				callFrame?.setUserName($session.user?.displayName);
			}

			// callFrame?.updateCustomTrayButtons({
			// 	btnLeave: {
			// 		iconPath: 'https://example.com/path/to/your/icon.svg',
			// 		iconPathDarkMode: 'https://example.com/path/to/your/darkmode/icon.svg',
			// 		label: $_('actions.leave'),
			// 		tooltip: $_('actions.leave_call')
			// 	}
			// });

			// callFrame?.on('custom-button-click', (ev) => {
			// 	const buttonID = ev.button_id;
			// 	if (buttonID !== 'btnLeave') return;
			// 	console.log('clicked leave button');
			// 	callFrame?.leave();
			// 	joinVideoCall.set(false);
			// });

			// showBtnEndCall.set(true);
			joinVideoCall.set(true);
			dataLoading.set(false);
			if (!callFrame) return;

			if (callFrame.participantCounts().present != 2) {
				if ($session.user?.uid == $ongoingAppointment.userId) {
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

			callFrame.on('left-meeting', async (event) => {
				console.log('left', event);
				joinVideoCall.set(false);
				ongoingAppointment.set(false);
				let session = callFrame?.meetingSessionSummary();

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
		});

		return () => {
			if (callFrame) {
				callFrame.leave();
				callFrame.destroy();
			}
		};
	}
</script>

<div class="video-container" bind:this={videoContainer}></div>

<style>
	.video-container {
		width: 100%;
		height: 100%;
		min-height: 300px;
		margin: 10px;
	}
</style>
