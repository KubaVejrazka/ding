import { db } from "$lib/server/db";
import { invite, user } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, locals }) => {
  let success = false;

  const token = params.token;
  if (token) {
    try {
      const targetInvite = await db.query.invite.findFirst({
        where: (invite, { eq }) => eq(invite.token, token)
      })

      if (targetInvite && targetInvite.email === locals.user?.email && !targetInvite.used && !locals.user.groupId) {

        db.transaction((tx) => {
          tx.update(user)
            .set({ groupId: targetInvite.groupId })
            .where(eq(user.id, locals.user!.id)).run();

          tx.update(invite)
            .set({ used: true })
            .where(eq(invite.token, token)).run();
        });

        success = true;
      }
    } catch (error) {
      console.log("Error joining group with token " + token + " (" + locals.user?.email + "): ", error)
    }
  }

  if (success) return redirect(302, '/dashboard')
}
