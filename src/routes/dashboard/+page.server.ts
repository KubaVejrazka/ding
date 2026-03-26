import { fail, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq } from 'drizzle-orm';
import { user } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { sendWelcomeMessage } from '$lib/server/services/sms';

export const load: PageServerLoad = async ({ locals }) => {
	const groupId = locals.user?.groupId;
	if (groupId) {
		const group = await db.query.group.findFirst({
			where: (group, { eq }) => eq(group.id, groupId),
			with: {
				users: {
					columns: {
						name: true,
						email: true,
						id: true
					}
				}
			},
			columns: {
				name: true,
				ownerId: true
			}
		});
		return { group };
	}
};

export const actions: Actions = {
	welcomeMessage: async (event) => {
		const currentUser = event.locals.user;
		// 1. Authorization & State Check
		if (!currentUser?.emailVerified || currentUser.welcomeMessageSent) {
			return fail(400, { message: 'Already sent or not verified' });
		}

		// 2. Rate Limiting (Extra safety, though welcomeMessageSent should cover it)
		const now = Date.now();
		if (currentUser.lastRateLimitAt && now - currentUser.lastRateLimitAt.getTime() < 60000) {
			return fail(429, { message: 'Please wait a minute' });
		}

		const result = await sendWelcomeMessage(currentUser.phone);

		if (result.success) {
			await db
				.update(user)
				.set({
					welcomeMessageSent: true,
					lastRateLimitAt: new Date()
				})
				.where(eq(user.id, currentUser.id));
			return { success: true };
		}
 else {
			return fail(result.status || 500);
		}
	},

	checkForReply: async (event) => {
		// This action is mainly used to trigger a data reload in the client.
		// SvelteKit re-runs the load function on every successful action.
		if (!event.locals.user?.lastMessageContent) return fail(400);
		return { success: true };
	},

	removeFromGroup: async (event) => {
		const formData = await event.request.formData();
		const uid = formData.get('id')?.toString();
		const currentUser = event.locals.user;

		if (uid && currentUser) {
			const targetUser = await db.query.user.findFirst({
				where: (u, { eq }) => eq(u.id, uid),
				with: {
					group: true
				}
			});

			// Only allow removal if:
			// 1. Target user is in the same group as current user
			// 2. Target user is not the owner of that group
			if (targetUser?.groupId === currentUser.groupId && uid !== targetUser?.group?.ownerId) {
				await db
					.update(user)
					.set({
						groupId: null
					})
					.where(eq(user.id, uid));
				return { success: true };
			}
		}
		return fail(400);
	}
};
