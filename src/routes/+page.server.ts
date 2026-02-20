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
          password
        }
      });
    } catch (error) {
      if (error instanceof APIError) {
        console.error("DURING LOGIN: " + error)
        return fail(400, { code: error.body?.code || 'UNKNOWN' });
      }
      console.error("DURING LOGIN: " + error)
      return fail(500, { code: 'UNKNOWN' });
    }

    return redirect(302, '/dashboard');
  },

  signUp: async (event) => {
    const formData = await event.request.formData();
    const email = formData.get('email')?.toString() ?? '';
    const phone = formData.get('phone')?.toString() ?? '';
    const password = formData.get('password')?.toString() ?? '';
    const passwordConfirmation = formData.get('passwordConfirmation')?.toString() ?? '';
    const name = formData.get('name')?.toString() ?? '';

    if (passwordConfirmation !== password) return fail(400, { code: 'PASSWORD_MISMATCH' });
    if (!(/^[\x00-\x7F]*$/.test(name)) || name.length > 15) return fail(400, { code: 'INVALID_USERNAME' })

    try {
      await auth.api.signUpEmail({
        body: {
          email,
          phone: "420" + phone,
          password,
          name,
          callbackURL: '/dashboard'
        }
      });
      console.log("User " + name + " (" + email + ") just signed up!")
    } catch (error) {
      if (error instanceof APIError) {
        console.error("DURING SIGNUP: " + error)
        return fail(400, { code: error.body?.code || 'UNKNOWN' });
      }
      console.error("DURING SIGNUP: " + error)
      return fail(500, { code: 'UNKNOWN' });
    }

    return redirect(302, '/verify');
  }
};
