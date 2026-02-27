import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { db } from "$lib/server/db"
import { eq } from "drizzle-orm"
import { group, user } from "$lib/server/db/schema"

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user?.groupId) return redirect(302, '/dashboard')
  const ownedGroup = await db.query.group.findFirst({
    where: (group, { eq }) => eq(group.ownerId, event.locals.user!.id)
  })
  if (!ownedGroup) return redirect(302, '/dashboard')

  return { groupName: ownedGroup.name }
}

export const actions: Actions = {
  rename: async (event) => {
    if (!event.locals.user?.groupId) return redirect(302, '/dashboard')
    const ownedGroup = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.ownerId, event.locals.user!.id),
    })
    if (!ownedGroup) return redirect(302, '/dashboard')

    const formData = await event.request.formData();
    const name = formData.get('name')?.toString() ?? '';
    if (!name || name.length > 30) return fail(400, { code: 'INVALID_NAME' })

    try {
      await db.update(group).set({
        name
      }).where(eq(group.id, event.locals.user.groupId))
    } catch (error) {
      console.error("Error updating group name (" + event.locals.user.email + "): ", error)
      return fail(500);
    }

    return redirect(302, '/dashboard')
  },

  deleteGroup: async (event) => {
    if (!event.locals.user?.groupId) return redirect(302, '/dashboard')
    const ownedGroup = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.ownerId, event.locals.user!.id),
      with: {
        users: true
      }
    })
    if (!ownedGroup) return redirect(302, '/dashboard')

    try {
      db.transaction((tx) => {
        tx.update(user).set({
          groupId: null
        }).where(eq(user.groupId, ownedGroup.id)).run();

        tx.delete(group).where(eq(group.id, ownedGroup.id)).run()
      })
    } catch (error) {
      console.error("Error deleting group (" + event.locals.user.email + "): ", error)
      return fail(500)
    }
    return redirect(302, '/dashboard')
  }
}
