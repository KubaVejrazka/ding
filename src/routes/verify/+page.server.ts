import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.emailVerified) return redirect(302, '/dashboard');
	return {};
};

export const actions: Actions = {
	sendVerificationEmail: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser) return redirect(302, '/');

		// 1. Rate Limiting (60 seconds)
		const now = Date.now();
		if (currentUser.lastRateLimitAt && now - currentUser.lastRateLimitAt.getTime() < 60000) {
			return fail(429, { message: 'Too many requests' });
		}

		try {
			await auth.api.sendVerificationEmail({
				body: {
					email: currentUser.email,
					callbackURL: '/dashboard'
				},
				headers: event.request.headers
			});

			// Update timestamp to rate limit next request
			await db.update(user).set({ lastRateLimitAt: new Date() }).where(eq(user.id, currentUser.id));

			console.log(
				`User ${currentUser.name} (${currentUser.email}) requested another verification email.`
			);
			return { success: true };
		} catch (error) {
			console.error(`Error resending verification email for ${currentUser.email}:`, error);
			return fail(500);
		}
	}
};
