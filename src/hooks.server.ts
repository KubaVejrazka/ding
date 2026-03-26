import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const { pathname } = event.url;

	// 1. Allow public routes
	const isPublicRoute =
		pathname === '/' || pathname.startsWith('/api/auth') || pathname === '/api/sms/receive';

	if (isPublicRoute) {
		// If user is logged in and tries to go to login page, redirect to dashboard
		// But only if it's not a POST request (which could be a signOut action)
		if (pathname === '/' && event.locals.user && event.request.method !== 'POST') {
			throw redirect(302, '/dashboard');
		}
		return svelteKitHandler({ event, resolve, auth, building });
	}

	// 2. Protect all other routes
	if (!event.locals.user) {
		throw redirect(302, '/');
	}

	// 3. Email verification check (except for /verify and logout)
	const isVerifyRoute = pathname === '/verify';
	const isSignOut = pathname === '/' && event.request.method === 'POST'; // Signout action is on /

	if (
		!event.locals.user.emailVerified &&
		!isVerifyRoute &&
		!isSignOut &&
		!pathname.startsWith('/api')
	) {
		throw redirect(302, '/verify');
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
