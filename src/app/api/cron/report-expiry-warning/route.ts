// app/api/cron/report-expiry-warning/route.ts
import { Op } from 'sequelize';
import { PetsFind, Owner } from 'bknd/models/models';
import { sendExpirationReminderEmail } from 'lib/resend_emails';

export async function GET() {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);

  const reportes = await PetsFind.findAll({
    where: {
      active: true,
      createdAt: {
        [Op.between]: [
          new Date(tomorrow.getTime() - 30 * 24 * 60 * 60 * 1000),
          new Date(tomorrow.getTime() - 29 * 24 * 60 * 60 * 1000)
        ]
      }
    },
    include: [{ model: Owner, as: 'owner' }]
  });

  let sentCount = 0;
  for (const reporte of reportes) {
    const owner = reporte.get('owner') as Owner;
    await sendExpirationReminderEmail({
      ownerEmail: owner.email,
      ownerName: owner.name,
      petName: reporte.name,
      daysRemaining: 1, // expira mañana
    });
    sentCount++;
  }

  console.log(`⚠️ Avisos de expiración (día 29) enviados: ${sentCount}`);
  return new Response(JSON.stringify({ success: true, sent: sentCount }), { status: 200 });
}