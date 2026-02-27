import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { user } from "$lib/server/db/schema";
import type { PageServerLoad } from "./$types";

const disableSMS = env.DISABLE_SMS === "true";

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user?.groupId) {
    const group = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.id, locals.user!.groupId),
      with: {
        users: {
          columns: {
            name: true,
            email: true,
            id: true
          }
        }
      },
      columns: {
        name: true,
        ownerId: true
      }
    });
    return { group };
  }
}

export const actions: Actions = {
  welcomeMessage: async (event) => {
    if (!event.locals.user?.emailVerified || event.locals.user.welcomeMessageSent) {
      return fail(400);
    }

    try {
      if (!disableSMS) {
        console.log("Sending welcome SMS to " + event.locals.user.email)
        const response = await event.fetch('https://portal.bulkgate.com/api/1.0/simple/transactional', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "application_id": env.BULKGATE_ID,
            "application_token": env.BULKGATE_TOKEN,
            "number": event.locals.user.phone,
            "text": "Vita Vas Ding :)",
            "unicode": "true",
            "country": "cz"
          })
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.error("Failed to send message (API rejection):", errorDetails);
          return fail(response.status);
        } else {
          await db.update(user).set({ welcomeMessageSent: true }).where(eq(user.id, event.locals.user!.id));
        }
      } else {
        console.log("Fake sending welcome message to " + event.locals.user.email)
        await db.update(user).set({ welcomeMessageSent: true }).where(eq(user.id, event.locals.user!.id));
      }
    } catch (error) {
      console.log(error);
      return fail(500);
    }
  },

  checkForReply: async (event) => {
    if (!event.locals.user?.latestMessage) return fail(400)
  },

  removeFromGroup: async (event) => {
    const formData = await event.request.formData();
    const uid = formData.get('id')?.toString()

    if (uid) {
      const targetUser = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, uid),
        with: {
          group: true
        }
      });
      if (targetUser?.groupId === event.locals.user?.groupId && uid !== targetUser?.group?.ownerId) {
        await db.update(user).set({
          groupId: null
        }).where(eq(user.id, uid))
      }
    }
  }
};
