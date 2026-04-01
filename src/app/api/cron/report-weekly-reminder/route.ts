// app/api/cron/report-weekly-reminder/route.ts
import { Op } from 'sequelize';
import { PetsFind, Owner } from 'bknd/models/models';
import { sendExpirationReminderEmail } from 'lib/resend_emails';

export async function GET() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Obtener reportes activos con al menos 7 días de antigüedad y que no hayan recibido recordatorio en los últimos 7 días
  const reportes = await PetsFind.findAll({
    where: {
      active: true,
      createdAt: { [Op.lte]: sevenDaysAgo },
      [Op.or]: [
        { lastReminderSent: null },
        { lastReminderSent: { [Op.lt]: sevenDaysAgo } }
      ]
    } as any,
    include: [{ model: Owner, as: 'owner' }]
  });

  let sentCount = 0;
  for (const reporte of reportes) {
    const owner = reporte.get('owner') as Owner; // ✅ acceso seguro
    const daysRemaining = Math.max(0, 30 - Math.floor((now.getTime() - new Date(reporte.createdAt).getTime()) / (1000 * 60 * 60 * 24)));

    // Solo enviar si aún no expiró (días restantes > 0)
    if (daysRemaining > 0) {
      await sendExpirationReminderEmail({
        ownerEmail: owner.email,
        ownerName: owner.name,
        petName: reporte.name,
        daysRemaining,
      });
      sentCount++;
    }

    // Actualizar fecha de último envío
    await reporte.update({ lastReminderSent: now });
  }

  console.log(`📧 Recordatorios semanales enviados: ${sentCount}`);
  return new Response(JSON.stringify({ success: true, sent: sentCount }), { status: 200 });
}