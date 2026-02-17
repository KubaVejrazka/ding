import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import transporter from './mail';

export const auth = betterAuth({
  baseURL: env.ORIGIN,
  secret: env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, { provider: 'sqlite' }),
  emailAndPassword: { enabled: true },
  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
        unique: true
      },
      groupId: {
        type: "string",
        required: false,
        input: false
      }
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      transporter.sendMail({
        subject: "Ding - Ověření emailu",
        from: "Ding <" + env.GOOGLE_USER + ">",
        to: user.email,
        html: `
<h1>Helou 🐈</h1>
<img src="https://media.tenor.com/_WZy7E7hoTcAAAAM/cat-smile.gif" />
<p>Ověřte si mail kliknutím <a href="${url}">tento odkaz</a>. :)</p>
`
      })
    }
  },
  plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
});
