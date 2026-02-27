import { fail, redirect, type Actions } from "@sveltejs/kit"
import type { PageServerLoad } from "./$types"
import { db } from "$lib/server/db"
import { invite } from "$lib/server/db/schema"
import transporter from "$lib/server/mail"
import { env } from "$env/dynamic/private"

export const load: PageServerLoad = async (event) => {
  if (!event.locals.user?.groupId) return redirect(302, '/dashboard')
  const ownedGroup = await db.query.group.findFirst({
    where: (group, { eq }) => eq(group.ownerId, event.locals.user!.id)
  })
  if (!ownedGroup) return redirect(302, '/dashboard')
}

export const actions: Actions = {
  addMember: async (event) => {
    if (!event.locals.user?.groupId) return redirect(302, '/dashboard')
    const ownedGroup = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.ownerId, event.locals.user!.id),
      with: {
        users: true
      }
    })
    if (!ownedGroup) return redirect(302, '/dashboard')

    const formData = await event.request.formData();
    const email = formData.get('email')?.toString() ?? '';
    if (!email) return fail(400);

    ownedGroup.users.forEach((user) => {
      if (user.email === email) return fail(400)
    })

    try {
      console.log("Sending invite link to " + email)
      const token = crypto.randomUUID()

      await db.insert(invite).values({
        token,
        email,
        groupId: event.locals.user!.groupId,
        used: false
      })

      transporter.sendMail({
        subject: "Ding - pozvánka do skupiny",
        from: "Ding <" + env.GOOGLE_USER + ">",
        to: email,
        html: `
<h1>${event.locals.user!.name} Vás pozval do svojí skupiny 🐈</h1>
<p>Pro připojení ke skupině se nejprve v prohlížeči <a href="https://ding.kubavejrazka.dev">přihlašte ke svému účtu Ding</a> a potom klikněte na <a href="https://ding.kubavejrazka.dev/api/sms/joinGroup/${token}">tento odkaz</a> :) Pokud účet ještě nemáte, <a href="https://ding.kubavejrazka.dev">založte si ho</a>. Pozor, je nutné se zaregistrovat se stejnou emailovou adresou, na kterou Vám přišla tato pozvánka. Pokud se zaregistrujete s jinou adresou, budete muset požádat o novou pozvánku.</p>
`
      })
    } catch (error) {
      console.error("Error inviting user " + email + " (invitation by " + event.locals.user!.email + "): ", error);
      return fail(500);
    }

    return redirect(302, '/dashboard')
  }
}
