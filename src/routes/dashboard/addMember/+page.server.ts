import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { inviteUser } from '$lib/server/services/group';

export const load: PageServerLoad = async (event) => {
	const currentUser = event.locals.user;
	if (!currentUser?.groupId) return redirect(302, '/dashboard');

	const ownedGroup = await db.query.group.findFirst({
		where: (group, { eq }) => eq(group.ownerId, currentUser.id)
	});

	if (!ownedGroup) return redirect(302, '/dashboard');
};

export const actions: Actions = {
	addMember: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser?.groupId) return redirect(302, '/dashboard');

		const ownedGroup = await db.query.group.findFirst({
			where: (group, { eq }) => eq(group.ownerId, currentUser.id),
			with: { users: true }
		});

		if (!ownedGroup) return redirect(302, '/dashboard');

		const formData = await event.request.formData();
		const email = formData.get('email')?.toString() ?? '';
		if (!email) return fail(400);

		// Check if user is already in the group
		if (ownedGroup.users.some((u) => u.email === email)) {
			return fail(400, { code: 'USER_ALREADY_IN_GROUP' });
		}

		try {
			await inviteUser(ownedGroup.id, currentUser.name, email);
		} catch (error) {
			console.error(`Error inviting user ${email} (by ${currentUser.email}):`, error);
			return fail(500);
		}

		return redirect(302, '/dashboard');
	}
};
