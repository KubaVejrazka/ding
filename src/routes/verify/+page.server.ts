import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user?.emailVerified) return redirect(302, '/dashboard');
  return {};
}

export const actions: Actions = {
  sendVerificationEmail: async (event) => {
    if (event.locals.user) {
      await auth.api.sendVerificationEmail({
        body: {
          email: event.locals.user!.email,
          callbackURL: '/dashboard'
        },
        headers: event.request.headers
      });
      console.log("User " + event.locals.user.name + " (" + event.locals.user.email + ") requested another verification email.")
    }
  }
}
