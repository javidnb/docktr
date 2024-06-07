<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DailyIframe from '@daily-co/daily-js';
	import type { DailyCall } from '@daily-co/daily-js';
	import { dataLoading, putData } from '$lib/store/dataStore';

	export let appointmentId: number;
	let callFrame: DailyCall | null = null;
	let roomUrl: string = 'https://sehiyye.daily.co/'; // Replace with your room URL
	let localVideo: HTMLVideoElement;
	let remoteVideo: HTMLVideoElement;
	let videoContainer: HTMLDivElement;
	let API_KEY = '9013923050beca02edf29057536ca66fb51a7e6a9fc33479bb9a7f0db2809dac';
	let DAILY_API_URL = 'https://api.daily.co/v1/';
	let roomId: any = null;

	onMount(() => {
		console.log(appointmentId);
		getRoom();
		// createRoom();
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
				roomUrl += result.roomId;
				launchVideoChatUI();
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
				exp: Math.floor(Date.now() / 1000) + 3600
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
			showLeaveButton: false,
			showFullscreenButton: true,
			iframeStyle: {
				position: 'absolute',
				width: '100vw',
				height: 'calc(100dvh - 28px)',
				border: 'none',
				top: '28px',
				left: '0px'
			}
		});

		callFrame.join({ url: roomUrl, videoSource: true, audioSource: true }).then(() => {
			dataLoading.set(false);
			if (!callFrame) return;

			callFrame.on('joined-meeting', () => {
				const localParticipant = callFrame?.participants().local;
				if (localParticipant?.tracks.video.persistentTrack) {
					const localStream = new MediaStream([localParticipant.tracks.video.persistentTrack]);
					localVideo.srcObject = localStream;
				}
			});

			callFrame.on('participant-joined', (event) => {
				const videoTrack = event.participant.tracks.video.persistentTrack;
				if (videoTrack) {
					const remoteStream = new MediaStream([videoTrack]);
					remoteVideo.srcObject = remoteStream;
				}
			});

			callFrame.on('participant-updated', (event) => {
				const videoTrack = event.participant.tracks.video.persistentTrack;
				if (videoTrack) {
					const remoteStream = new MediaStream([videoTrack]);
					remoteVideo.srcObject = remoteStream;
				}
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

<!-- <div>
	<video bind:this={localVideo} autoplay muted>
		<track kind="captions" srclang="en" label="English captions" />
	</video>
	<video bind:this={remoteVideo} autoplay>
		<track kind="captions" srclang="en" label="English captions" />
	</video>
</div> -->

<div class="video-container" bind:this={videoContainer}></div>

<style>
	.video-container {
		width: 100%;
		height: 100%;
		min-height: 300px;
		margin: 10px;
	}
</style>
