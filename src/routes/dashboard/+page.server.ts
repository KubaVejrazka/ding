import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { eq } from "drizzle-orm";
import { user } from "$lib/server/db/schema";

const disableSMS = env.DISABLE_SMS === "true";

export const actions: Actions = {
  welcomeMessage: async (event) => {
    if (!event.locals.user?.emailVerified || event.locals.user.welcomeMessageSent) {
      return fail(401);
    }

    try {
      if (!disableSMS) {
        const response = await event.fetch('https://api.smsmngr.com/v2/message', {
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
            "x-api-key": env.SMS_API_KEY
          },
          body: JSON.stringify({
            "flow": [
              {
                "sms": {
                  "body": "Vita vas Ding :)",
                  "gateway": "direct",
                  "sender": env.SMS_SENDER
                }
              }
            ],
            "to": [
              {
                "phone_number": event.locals.user.phone
              }
            ]
          })
        });

        if (!response.ok) {
          const errorDetails = await response.text();
          console.error("Failed to send message (API rejection):", errorDetails);
          return fail(response.status);
        }
      }

      await db.update(user).set({ welcomeMessageSent: true }).where(eq(user.id, event.locals.user!.id))

    } catch (error) {
      console.log(error);
      return fail(500);
    }
  },

  checkForReply: async (event) => {
    if (!event.locals.user?.latestMessage) return fail(400)
  }
};
