// lib/webpush.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:tu@email.com',
  process.env.WEB_PUSH_PUBLIC_KEY!,
  process.env.WEB_PUSH_PRIVATE_KEY!
);

console.log('✅ Web Push configurado');

export default webpush;