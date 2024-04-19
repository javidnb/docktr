/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
	...build, // the app itself
	...files // everything in `static`
];

self.addEventListener('install', (event) => {
	// Create a new cache and add all files to it
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
	// Remove previous cached data from disk
	async function deleteOldCaches() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	event.waitUntil(deleteOldCaches());
});

self.addEventListener('push', (event) => {
	console.log(event);
	const notif = event.data.json().notification;

	event.waitUntil(
		self.registration.showNotification(notif.title, {
			body: notif.body,
			icon: notif.image,
			data: {
				url: notif.click_action
			}
		})
	);
});

self.addEventListener('notificationclick', (event) => {
	event.waitUntil(clients.openWindow(event.notification.data.url));
});
