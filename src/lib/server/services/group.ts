import { db } from '$lib/server/db';
import { group, user, invite } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import transporter from '$lib/server/mail';
import { env } from '$env/dynamic/private';

/**
 * Fetches a group owned by a specific user.
 */
export async function getOwnedGroup(ownerId: string) {
	return db.query.group.findFirst({
		where: (group, { eq }) => eq(group.ownerId, ownerId),
		with: {
			users: {
				columns: {
					name: true,
					email: true,
					id: true
				}
			}
		}
	});
}

/**
 * Creates a new group and assigns the owner.
 */
export function createGroup(name: string, ownerId: string) {
	const newGroupId = crypto.randomUUID();

	return db.transaction((tx) => {
		tx.insert(group)
			.values({
				id: newGroupId,
				name,
				ownerId
			})
			.run();

		tx.update(user)
			.set({ groupId: newGroupId })
			.where(eq(user.id, ownerId))
			.run();

		return { id: newGroupId };
	});
}

/**
 * Invites a user to a group via email.
 */
export async function inviteUser(groupId: string, inviterName: string, email: string) {
	const token = crypto.randomUUID();

	await db.insert(invite).values({
		token,
		email,
		groupId,
		used: false
	});

	const origin = env.ORIGIN || 'https://ding.kubavejrazka.dev';
	const inviteLink = `${origin}/api/sms/joinGroup/${token}`;
	const dashboardLink = origin;

	await transporter.sendMail({
		subject: 'Ding - pozvánka do skupiny',
		from: `Ding <${env.GOOGLE_USER}>`,
		to: email,
		html: `
			<h1>${inviterName} Vás pozval do svojí skupiny 🐈</h1>
			<p>Pro připojení ke skupině se nejprve v prohlížeči <a href="${dashboardLink}">přihlašte ke svému účtu Ding</a> a potom klikněte na <a href="${inviteLink}">tento odkaz</a> :)</p>
			<p>Pokud účet ještě nemáte, <a href="${dashboardLink}">založte si ho</a>. Pozor, je nutné se zaregistrovat se stejnou emailovou adresou, na kterou Vám přišla tato pozvánka.</p>
		`
	});

	return { token };
}

/**
 * Joins a group using an invite token.
 */
export async function joinGroupByToken(token: string, userId: string, userEmail: string) {
	const targetInvite = await db.query.invite.findFirst({
		where: (i, { eq, and }) => and(eq(i.token, token), eq(i.used, false), eq(i.email, userEmail))
	});

	if (!targetInvite) return { success: false, error: 'invalid invite' };

	db.transaction((tx) => {
		tx.update(user)
			.set({ groupId: targetInvite.groupId })
			.where(eq(user.id, userId))
			.run();

		tx.update(invite)
			.set({ used: true })
			.where(eq(invite.token, token))
			.run();
	});

	return { success: true, groupId: targetInvite.groupId };
}

/**
 * Removes a user from a group.
 */
export async function removeUserFromGroup(userId: string, targetUid: string, groupId: string) {
	const targetUser = await db.query.user.findFirst({
		where: (u, { eq }) => eq(u.id, targetUid),
		with: { group: true }
	});

	if (!targetUser || targetUser.groupId !== groupId) return { success: false, error: 'user not in group' };
	if (targetUser.group?.ownerId === targetUid && userId !== targetUid)
		return { success: false, error: 'cannot remove owner' };

	await db
		.update(user)
		.set({ groupId: null })
		.where(eq(user.id, targetUid));

	return { success: true };
}

/**
 * Renames an existing group.
 */
export async function renameGroup(groupId: string, newName: string) {
	await db.update(group).set({ name: newName }).where(eq(group.id, groupId));
	return { success: true };
}

/**
 * Deletes a group and removes all members from it.
 */
export function deleteGroup(groupId: string) {
	return db.transaction((tx) => {
		// Remove all users from the group first
		tx.update(user)
			.set({ groupId: null })
			.where(eq(user.groupId, groupId))
			.run();

		// Delete the group
		tx.delete(group)
			.where(eq(group.id, groupId))
			.run();

		return { success: true };
	});
}
