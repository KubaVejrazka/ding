import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { renameGroup, deleteGroup } from '$lib/server/services/group';

export const load: PageServerLoad = async (event) => {
	const currentUser = event.locals.user;
	if (!currentUser?.groupId) return redirect(302, '/dashboard');

	const ownedGroup = await db.query.group.findFirst({
		where: (group, { eq }) => eq(group.ownerId, currentUser.id)
	});

	if (!ownedGroup) return redirect(302, '/dashboard');

	return { groupName: ownedGroup.name };
};

export const actions: Actions = {
	rename: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser?.groupId) return redirect(302, '/dashboard');

		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() ?? '';
		if (!name || name.length > 30) return fail(400, { code: 'INVALID_NAME' });

		try {
			await renameGroup(currentUser.groupId, name);
		} catch (error) {
			console.error(`Error updating group name (by ${currentUser.email}):`, error);
			return fail(500);
		}

		return redirect(302, '/dashboard');
	},

	deleteGroup: async (event) => {
		const currentUser = event.locals.user;
		if (!currentUser?.groupId) return redirect(302, '/dashboard');

		const ownedGroup = await db.query.group.findFirst({
			where: (group, { eq }) => eq(group.ownerId, currentUser.id)
		});

		if (!ownedGroup) return redirect(302, '/dashboard');

		try {
			deleteGroup(ownedGroup.id);
		} catch (error) {
			console.error(`Error deleting group (by ${currentUser.email}):`, error);
			return fail(500);
		}

		return redirect(302, '/dashboard');
	}
};
