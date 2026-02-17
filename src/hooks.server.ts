import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
  const session = await auth.api.getSession({ headers: event.request.headers });

  if (session) {
    event.locals.session = session.session;
    event.locals.user = session.user;
  }

  if (
    !event.locals.user &&
    event.url.pathname !== '/'
  ) return redirect(302, '/');
  else if (
    event.url.pathname !== '/' &&
    event.url.pathname !== '/verify' &&
    !event.locals.user?.emailVerified &&
    !event.url.pathname.startsWith('/api/auth')
  ) return redirect(302, '/verify')

  return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
