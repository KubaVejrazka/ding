import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { fail, redirect, type Actions } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { PageServerLoad } from './$types';
import { isValidCzechPhone } from '$lib/utils/phone';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.welcomeMessageSent) return redirect(302, '/dashboard');
};

export const actions: Actions = {
	fixPhone: async (event) => {
		const currentUser = event.locals.user;
		if (currentUser?.welcomeMessageSent) return redirect(302, '/dashboard');

		const formData = await event.request.formData();
		const phone = formData.get('phone')?.toString() ?? '';

		if (!isValidCzechPhone(phone)) {
			return fail(400, { code: 'INVALID_PHONE' });
		}

		try {
			await db
				.update(user)
				.set({ phone: '420' + phone })
				.where(eq(user.id, currentUser!.id));
		} catch (error) {
			console.error(`Error updating phone number (for ${currentUser?.email}):`, error);
			return fail(500);
		}

		return redirect(302, '/dashboard');
	}
};
