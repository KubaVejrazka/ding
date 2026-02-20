import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const allowedUsers = ['admin', 'sms'];
const validPassword = env.SMS_AUTH_PASSWORD;

export const POST: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get('Authorization');

  const requireAuth = () => {
    return json(
      { message: 'auth fail' },
      {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="SMS API"'
        }
      }
    );
  };

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return requireAuth();
  }

  try {
    const base64Credentials = authHeader.split(' ')[1];
    const decodedCredentials = atob(base64Credentials);
    const [username, password] = decodedCredentials.split(':');

    if (!allowedUsers.includes(username) || password !== validPassword) {
      return requireAuth();
    }

    const body = await request.json();
    console.log(username + " to SMS receive endpoint: " + body);

    return json({
      message: 'ok'
    });
  } catch (err) {
    return requireAuth();
  }
};
