<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import DailyIframe from '@daily-co/daily-js';
	import type { DailyCall } from '@daily-co/daily-js';

	let callFrame: DailyCall | null = null;
	const roomUrl: string = 'https://sehiyye.daily.co/jgRrskswBnwD3iQvsKSV'; // Replace with your room URL
	let localVideo: HTMLVideoElement;
	let remoteVideo: HTMLVideoElement;
	let videoContainer: HTMLDivElement;

	onMount(() => {
		callFrame = DailyIframe.createFrame(videoContainer, {
			showLeaveButton: true,
			iframeStyle: {
				position: 'relative',
				width: '100%',
				height: '500px',
				border: 'none'
			}
		});

		callFrame.join({ url: roomUrl, videoSource: true, audioSource: true }).then(() => {
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
	});

	onDestroy(() => {
		if (callFrame) {
			callFrame.leave();
			callFrame.destroy();
		}
	});
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
