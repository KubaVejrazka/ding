import { auth } from "$lib/server/auth";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { APIError } from "better-auth";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user) return redirect(302, '/dashboard');
  return {};
}

export const actions: Actions = {
  signOut: async (event) => {
    await auth.api.signOut({
      headers: event.request.headers
    });
    return {};
  },

  signIn: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';

    try {
      await auth.api.signInEmail({
        body: {
          email,
          password,
          callbackURL: '/auth/verification-success'
        }
      });
    } catch (error) {
      if (error instanceof APIError) {
        return fail(400, { code: error.body?.code || 'UNKNOWN' });
      }
      return fail(500, { code: 'UNKNOWN' });
    }

    return redirect(302, '/dashboard');
  },

  signUp: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email')?.toString() ?? '';
    const phone = formData.get('phone')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';
    const name = formData.get('name')?.toString() ?? '';

    try {
      await auth.api.signUpEmail({
        body: {
          email,
          phone,
          password,
          name,
          callbackURL: '/auth/verification-success'
        }
      });
    } catch (error) {
      if (error instanceof APIError) {
        return fail(400, { code: error.body?.code || 'UNKNOWN' });
      }
      return fail(500, { code: 'UNKNOWN' });
    }

    return redirect(302, '/dashboard');
  }
};
