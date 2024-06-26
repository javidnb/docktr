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
	const notif = event.data.json();
	console.log('notification received: ', notif);

	event.waitUntil(
		self.registration.showNotification(notif.notification.title, {
			body: notif.notification.body,
			icon: notif.notification.image || null,
			data: {
				url: notif.data.click_action || null
			}
		})
	);
});

self.addEventListener('notificationclick', (event) => {
	event.waitUntil(clients.openWindow(event.notification.data.url));
});
