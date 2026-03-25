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
				type: 'string',
				required: true,
				unique: true
			},
			groupId: {
				type: 'string',
				input: false
			},
			welcomeMessageSent: {
				type: 'boolean',
				required: true,
				defaultValue: false,
				input: false
			},
			lastMessageContent: {
				type: 'string',
				input: false
			},
			lastMessageReceivedAt: {
				type: 'date',
				input: false
			},
			lastRateLimitAt: {
				type: 'date',
				input: false
			},
			credit: {
				type: 'number',
				input: false,
				defaultValue: 10,
				required: true
			}
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		sendVerificationEmail: async ({ user, url }) => {
			transporter.sendMail({
				subject: 'Ding - Ověření emailu',
				from: `Ding <${env.GOOGLE_USER}>`,
				to: user.email,
				html: `
					<h1>Helou 🐈</h1>
					<img src="https://media.tenor.com/_WZy7E7hoTcAAAAM/cat-smile.gif" alt="Happy cat" />
					<p>Ověřte si mail kliknutím na <a href="${url}">tento odkaz</a>. :)</p>
				`
			});
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)]
});
