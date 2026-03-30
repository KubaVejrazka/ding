import { fail, type Actions } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import { user } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';
import { sendWelcomeMessage } from '$lib/server/services/sms';
import { removeUserFromGroup } from '$lib/server/services/group';

export const load: PageServerLoad = async ({ locals }) => {
  const groupId = locals.user?.groupId;
  if (groupId) {
    const group = await db.query.group.findFirst({
      where: (group, { eq }) => eq(group.id, groupId),
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
};

export const actions: Actions = {
  welcomeMessage: async (event) => {
    const currentUser = event.locals.user;
    // Authorization & State Check
    if (!currentUser?.emailVerified || currentUser.welcomeMessageSent) {
      return fail(400, { message: 'Already sent or not verified' });
    }

    // Rate Limiting
    const now = Date.now();
    if (currentUser.lastRateLimitAt && now - currentUser.lastRateLimitAt.getTime() < 60000) {
      return fail(429, { message: 'Please wait a minute' });
    }

    // Atomically mark as sent to prevent race conditions
    const updateResult = await db
      .update(user)
      .set({
        welcomeMessageSent: true,
        lastRateLimitAt: new Date()
      })
      .where(and(eq(user.id, currentUser.id), eq(user.welcomeMessageSent, false)));

    // If no rows were updated, it means another request is already marked it as sent
    if (updateResult.changes === 0) {
      return fail(400, { message: 'Already sent' });
    }

    const result = await sendWelcomeMessage(currentUser.phone);

    if (!result.success) {
      return fail(result.status || 500);
    }

    return { success: true };
  },

  removeFromGroup: async (event) => {
    const formData = await event.request.formData();
    const uid = formData.get('id')?.toString();
    const currentUser = event.locals.user;

    if (uid && currentUser?.groupId) {
      const result = await removeUserFromGroup(currentUser.id, uid, currentUser.groupId);
      if (result.success) {
        return { success: true };
      }
    }
    return fail(400);
  },

  checkForReply: async () => {
    // Re-run the load function via use:enhance
    return {};
  }
};
