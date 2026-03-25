import { env } from '$env/dynamic/private';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq, sql } from 'drizzle-orm';
import transporter from '$lib/server/mail';
import { sanitizeForSMS } from '$lib/utils/sms';

const BULKGATE_ID = env.BULKGATE_ID;
const BULKGATE_TOKEN = env.BULKGATE_TOKEN;
const DISABLE_SMS = env.DISABLE_SMS === 'true';
const TEST_USERS = env.TEST_USERS.split(' ');

interface SendSMSParams {
	number: string;
	text: string;
	country?: string;
}

/**
 * Sends a transactional SMS via BulkGate API.
 */
export async function sendSMS({ number, text, country = 'cz' }: SendSMSParams) {
	if (DISABLE_SMS) {
		console.log(`[DEV] Sending fake SMS to ${number}: ${text}`);
		return { success: true, fake: true };
	}

	try {
		const response = await fetch('https://portal.bulkgate.com/api/1.0/simple/transactional', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				application_id: BULKGATE_ID,
				application_token: BULKGATE_TOKEN,
				number,
				text,
				country
			})
		});

		if (!response.ok) {
			const errorDetails = await response.text();
			console.error(`Failed to send SMS to ${number}:`, errorDetails);
			return { success: false, error: errorDetails, status: response.status };
		}

		return { success: true };
	} catch (error) {
		console.error('Error while sending SMS:', error);
		return { success: false, error };
	}
}

/**
 * Sends a welcome message to a new user.
 */
export async function sendWelcomeMessage(phone: string) {
	return sendSMS({
		number: phone,
		text: 'Vita Vas Ding :)'
	});
}

/**
 * Processes an incoming SMS webhook.
 */
export async function processIncomingSMS(from: string, message: string) {
	const sender = await db.query.user.findFirst({
		where: (u, { eq }) => eq(u.phone, from)
	});

	if (!sender) return { status: 'sender not found' };

	console.log(`Incoming message from ${sender.email}`);

	const sanitizedMessage = sanitizeForSMS(message);
	const broadcastMessage = sanitizeForSMS(`${sender.name}:\n\n${sanitizedMessage}`);

	// Update latest message for dashboard display
	await db
		.update(user)
		.set({
			lastMessageContent: sanitizedMessage,
			lastMessageReceivedAt: new Date()
		})
		.where(eq(user.id, sender.id));

	if (!sender.groupId) return { status: 'no group' };

	const targetGroup = await db.query.group.findFirst({
		where: (g, { eq }) => eq(g.id, sender.groupId!),
		with: { users: true }
	});

	if (!targetGroup) return { status: 'group not found' };

	const recipients = targetGroup.users.filter((u) => u.id !== sender.id);
	const costPerBroadcast = recipients.length * 2;

	// Credit check (skip for test users)
	if (sender.credit < costPerBroadcast && !TEST_USERS.includes(sender.email)) {
		console.log(`Insufficient credit for ${sender.email}`);
		await transporter.sendMail({
			subject: 'Ding - nedostatečný kredit',
			from: `Ding <${env.GOOGLE_USER}>`,
			to: sender.email,
			html: `
				<h1>Došel Vám kredit 🐈</h1>
				<p>Vaše poslední zpráva nebyla doručena do skupiny, protože nemáte dostatečně vysoký kredit. 
				Pro poslání zprávy ${targetGroup.users.length - 1} lidem musíte mít na svém Ding účtě alespoň ${costPerBroadcast} Kč. 
				Prosím, dobijte si kredit a zkuste to znovu :)</p>
			`
		});
		return { status: 'insufficient credit' };
	}

	// Broadcast message to all group members except the sender
	let successfullySentCount = 0;
	for (const recipient of recipients) {
		const result = await sendSMS({
			number: recipient.phone,
			text: broadcastMessage
		});

		if (result.success) {
			successfullySentCount++;
		}
	}

	// Update sender's credit atomically in the database
	if (successfullySentCount > 0) {
		const totalCost = successfullySentCount * 2;
		await db
			.update(user)
			.set({
				credit: sql`${user.credit} - ${totalCost}`
			})
			.where(eq(user.id, sender.id));
	}

	return { status: 'ok', sentCount: successfullySentCount };
}
