// app/api/notif/push/notify-nearby/route.ts
import sequelizeClient from 'bknd/models/db';
import { PushSubscription } from 'bknd/models/models';
import webpush from 'lib/webpush';
import { QueryTypes } from 'sequelize';

const RADIUS_KM = 10;

export async function POST(request: Request) {
  const { latitude, longitude, userId } = await request.json();

  // Buscar reportes cercanos
  const pets = await sequelizeClient.query(
    `
    SELECT * FROM pets
    WHERE active = true
    AND ST_DWithin(
      ST_MakePoint(longitude, latitude)::geography,
      ST_MakePoint(:lng, :lat)::geography,
      :radius
    )
    `,
    {
      replacements: { lat: latitude, lng: longitude, radius: RADIUS_KM * 1000 },
      type: QueryTypes.SELECT
    }
  );

  if (pets.length === 0) {
    return new Response(JSON.stringify({ success: true, message: 'Sin reportes cercanos' }), { status: 200 });
  }

  // Buscar suscripción push del usuario
  const subscription = await PushSubscription.findOne({ where: { userId } });

  if (!subscription) {
    return new Response(JSON.stringify({ success: false, message: 'Sin suscripción push' }), { status: 404 });
  }

  // Mandar notificación push
  await webpush.sendNotification(
    {
      endpoint: subscription.endpoint,
      keys: { p256dh: subscription.p256dh, auth: subscription.auth }
    },
    JSON.stringify({
      title: '🐾 Mascota perdida cerca',
      body: `Hay ${pets.length} reporte${pets.length > 1 ? 's' : ''} cerca de tu ubicación`,
      url: '/home'
    })
  );

  console.log(`Push enviada al usuario ID: ${userId}`);
  return new Response(JSON.stringify({ success: true }), { status: 200 });
}




// Esto va en el frontend si o si
// Y en el frontend registrás el Service Worker y guardás la suscripción:
// lib/pushNotifications.ts
//La búsqueda pasiva la activás mandando las coords al endpoint notify-nearby periódicamente desde el frontend mientras la app está abierta en segundo plano.
export async function registerPushNotifications(token: string) {
  // Registrar Service Worker
  const registration = await navigator.serviceWorker.register('/sw.js');
  
  // Pedir permiso
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  // Suscribirse
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  });

  // Guardar suscripción en el backend
  await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(subscription)
  });

  console.log('✅ Push notifications registradas');
  return subscription;
}