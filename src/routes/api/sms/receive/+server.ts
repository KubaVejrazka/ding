import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const disableSMS = env.DISABLE_SMS === "true";

export const GET: RequestHandler = async ({ url }) => {
  try {
    const secret = url.searchParams.get('secret');

    if (secret !== env.WEBHOOK_SECRET) {
      return json({ message: 'auth fail' })
    }

    const statusParam = url.searchParams.get('status');
    const senderParam = url.searchParams.get('from') ?? '';
    const messageParam = url.searchParams.get('message');

    if (statusParam === "10") {
      const sender = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.phone, senderParam)
      })
      if (sender) {
        const senderId = sender.id;
        const groupId = sender.groupId;

        console.log("Incoming message from " + sender.email)

        await db.update(user).set({
          latestMessage: messageParam,
          latestMessageTime: new Date()
        }).where(eq(user.id, senderId))

        if (groupId) {
          const targetGroup = await db.query.group.findFirst({
            where: (group, { eq }) => eq(group.id, groupId),
            with: {
              users: true
            }
          });

          if (targetGroup) {
            let senderCredit = sender.credit;

            for (const u of targetGroup.users) {
              if (u.id === senderId) { // TEMPORARY FOR TESTING
                if (!disableSMS) {
                  const response = await fetch('https://api.smsmngr.com/v2/message', {
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      "application_id": env.BULKGATE_ID,
                      "application_token": env.BULKGATE_TOKEN,
                      "number": u.phone,
                      "text": sender.name + "\n\n" + messageParam,
                      "country": "cz"
                    })
                  });

                  if (!response.ok) {
                    const errorDetails = await response.text();
                    console.error("Failed to send message to " + u.phone + " (" + u.email + ") - API rejection:", errorDetails);
                  } else {
                    senderCredit -= 2;
                  }
                }
              }
            }
          }
        }

      }
    }

    return json({
      message: 'ok'
    });
  } catch (err) {
    console.error(err)
    return json({
      message: 'error'
    });
  }
};
