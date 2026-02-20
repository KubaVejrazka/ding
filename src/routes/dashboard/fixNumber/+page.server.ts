import { db } from "$lib/server/db";
import { user } from "$lib/server/db/schema";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
  if (event.locals.user?.welcomeMessageSent) return redirect(302, '/dashboard')
}

export const actions: Actions = {
  fixPhone: async (event) => {
    const formData = await event.request.formData();
    const phone = formData.get('phone')?.toString() ?? '';
    if (!(/^[0-9]{9}$/.test(phone)) || event.locals.user?.welcomeMessageSent) return fail(400, { code: 'INVALID_PHONE' });

    try {
      await db.update(user).set({ phone: "420" + phone }).where(eq(user.id, event.locals.user!.id))
    } catch (error) {
      return fail(500);
    }

    return redirect(302, '/dashboard')
  }
}
