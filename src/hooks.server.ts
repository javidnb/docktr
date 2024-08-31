import type { RequestEvent } from '@sveltejs/kit';

export function handleError({ event, error }: { event: RequestEvent; error: Error }) {
	return {
		message: 'An error occurred',
		stack: error
	};
}
