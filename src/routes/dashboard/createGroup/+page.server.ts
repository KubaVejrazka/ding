import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { db } from "$lib/server/db"
import { group, user } from "$lib/server/db/schema"
import { eq } from "drizzle-orm"

export const load: PageServerLoad = async (event) => {
  if (event.locals.user?.groupId) return redirect(302, '/dashboard')
}

export const actions: Actions = {
  createGroup: async (event) => {
    if (event.locals.user?.groupId) return redirect(302, '/dashboard')

    const formData = await event.request.formData();
    const name = formData.get('name')?.toString() ?? '';
    if (!name || name.length > 30) return fail(400, { code: 'INVALID_NAME' })

    try {
      const newGroupId = crypto.randomUUID()

      db.transaction((tx) => {
        tx.insert(group).values({
          id: newGroupId,
          name,
          ownerId: event.locals.user!.id
        }).run();

        tx.update(user)
          .set({ groupId: newGroupId })
          .where(eq(user.id, event.locals.user!.id)).run();
      });
    } catch (error) {
      console.error("Error creating group " + name + " (" + event.locals.user!.email + "): ", error);
      return fail(500);
    }

    return redirect(302, '/dashboard')
  }
}
