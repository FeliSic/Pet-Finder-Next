// app/api/notif/push/subscribe/route.ts
import { PushSubscription } from 'bknd/models/models';
import { verifyToken } from 'lib/jwt-auth';
import parseBearerToken from 'parse-bearer-token';
import { IncomingMessage } from 'http';

export async function POST(request: Request) {
  const headers: { [key: string]: string } = {};
  request.headers.forEach((value, key) => { headers[key] = value; });
  const token = parseBearerToken({ headers } as IncomingMessage);
  const tokenData = verifyToken(token!);
  
  if (!tokenData || typeof tokenData === 'string') {
    return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
  }

  const { endpoint, keys } = await request.json();

  await PushSubscription.upsert({
    userId: tokenData.id,
    endpoint,
    p256dh: keys.p256dh,
    auth: keys.auth
  });

  console.log(`✅ Suscripción push guardada para usuario ID: ${tokenData.id}`);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}