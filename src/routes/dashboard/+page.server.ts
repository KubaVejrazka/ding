import { env } from "$env/dynamic/private";
import { fail, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
  testSMS: async (event) => {
    const user = event.locals.user;
    if (!(user?.email === "jakvejr@gmail.com" && user?.emailVerified)) {
      return fail(401);
    }

    try {
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
                "body": "Mnau",
                "gateway": "direct",
                "sender": env.SMS_SENDER
              }
            }
          ],
          "to": [
            {
              "phone_number": "420" + user.phone
            }
          ]
        })
      });

      if (!response.ok) {
        const errorDetails = await response.text();
        console.error("API POST Failed:", errorDetails);
        return fail(response.status, {
          error: "The API rejected the request.",
          details: errorDetails
        });
      }

      const responseData = await response.json();

      return {
        success: true,
        message: "SMS sent successfully!",
        data: responseData
      };
    } catch (error) {
      console.log(error);
      return fail(500);
    }
  }
};
