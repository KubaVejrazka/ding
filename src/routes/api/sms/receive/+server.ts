import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import transporter from '$lib/server/mail';
import { json, type RequestHandler } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

const disableSMS = env.DISABLE_SMS === "true";
const testUsers = env.TEST_USERS.split(' ');

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

            if (senderCredit / 2 < targetGroup.users.length - 1 && !testUsers.includes(sender.email)) {
              console.log("User " + sender.email + " does not have enough credit to send a message to " + (targetGroup.users.length - 1) + " people. Sending them an email...")

              transporter.sendMail({
                subject: "Ding - nedostatečný kredit",
                from: "Ding <" + env.GOOGLE_USER + ">",
                to: sender.email,
                html: `
<h1>Došel Vám kredit 🐈</h1>
<p>Vaše poslední zpráva nebyla doručena do skupiny, protože nemáte dostatečně vysoký kredit. Pro poslání zprávy ${targetGroup.users.length - 1} lidem musíte mít na svém Ding účtě alespoň ${(targetGroup.users.length - 1) * 2} Kč. Prosím, dobijte si kredit a zkuste to znovu :)</p>
`
              })

              return json({
                message: 'insufficient credit'
              });
            }

            for (const u of targetGroup.users) {
              if (u.id !== senderId) { // brani tomu, aby uzivateli prisla zpet jeho vlastni zprava
                if (!disableSMS && messageParam!.length <= 140) {
                  const response = await fetch('https://portal.bulkgate.com/api/1.0/simple/transactional', {
                    method: 'POST',
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      "application_id": env.BULKGATE_ID,
                      "application_token": env.BULKGATE_TOKEN,
                      "number": u.phone,
                      "text": sender.name + ":\n\n" + messageParam,
                      "country": "cz"
                    })
                  });

                  if (!response.ok) {
                    const errorDetails = await response.text();
                    console.error("Failed to send message to " + u.email + " - API rejection:", errorDetails);
                  } else {
                    senderCredit -= 2;
                  }
                } else {
                  console.log("Fake sending message to " + u.email)
                  senderCredit -= 2;
                }
              }
            }

            await db.update(user).set({
              credit: senderCredit
            }).where(eq(user.id, senderId))
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
