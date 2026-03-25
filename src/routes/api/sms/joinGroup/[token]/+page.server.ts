import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { joinGroupByToken } from '$lib/server/services/group';

export const load: PageServerLoad = async ({ params, locals }) => {
	const currentUser = locals.user;
	if (!currentUser) return redirect(302, '/');

	const token = params.token;
	if (token) {
		try {
			const result = await joinGroupByToken(token, currentUser.id, currentUser.email);
			if (result.success) {
				return redirect(302, '/dashboard');
			}
		} catch (error) {
			console.error(`Error joining group with token ${token} (by ${currentUser.email}):`, error);
		}
	}

	// If joining fails or no token, redirect to dashboard anyway (or show error)
	return redirect(302, '/dashboard');
};
