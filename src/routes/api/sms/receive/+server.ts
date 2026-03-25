import { env } from '$env/dynamic/private';
import { processIncomingSMS } from '$lib/server/services/sms';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const secret = url.searchParams.get('secret');

		if (secret !== env.WEBHOOK_SECRET) {
			return json({ message: 'auth fail' }, { status: 401 });
		}

		const status = url.searchParams.get('status');
		const from = url.searchParams.get('from') ?? '';
		const message = url.searchParams.get('message') ?? '';

		// BulkGate status "10" means received SMS
		if (status === '10') {
			const result = await processIncomingSMS(from, message);
			return json({ message: result.status });
		}

		return json({ message: 'ok' });
	} catch (err) {
		console.error('Error in SMS receive webhook:', err);
		return json({ message: 'error' }, { status: 500 });
	}
};
