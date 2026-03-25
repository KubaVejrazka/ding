import { fail, redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { createGroup } from '$lib/server/services/group';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user?.groupId) return redirect(302, '/dashboard');
};

export const actions: Actions = {
	createGroup: async (event) => {
		const currentUser = event.locals.user;
		if (currentUser?.groupId) return redirect(302, '/dashboard');

		const formData = await event.request.formData();
		const name = formData.get('name')?.toString() ?? '';
		if (!name || name.length > 30) return fail(400, { code: 'INVALID_NAME' });

		try {
			createGroup(name, currentUser!.id);
		} catch (error) {
			console.error(`Error creating group ${name} (by ${currentUser!.email}):`, error);
			return fail(500);
		}

		return redirect(302, '/dashboard');
	}
};
