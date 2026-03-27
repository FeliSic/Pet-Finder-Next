// report-weekly-reminder/route.ts
import { Op } from 'sequelize';
import { PetsFind, Owner } from 'bknd/models/models';
import sendEmail from 'lib/nodemailer_email';

export async function GET() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const reportes = await PetsFind.findAll({
    where: {
      active: true,
      createdAt: { [Op.lte]: sevenDaysAgo }, // solo reportes con al menos 7 días
      [Op.or]: [
        { lastReminderSent: null },                 // nunca enviado
        { lastReminderSent: { [Op.lt]: sevenDaysAgo } } // último envío hace más de 7 días
      ]
    } as any,
    include: [{ model: Owner, as: 'owner' }]
  });

  for (const reporte of reportes) {
    const owner = reporte.get('owner') as Owner;
    const diasRestantes = Math.max(0, 30 - Math.floor((now.getTime() - new Date(reporte.createdAt).getTime()) / (1000 * 60 * 60 * 24)));
    
    await sendEmail(
      owner.email,
      '¿Seguís buscando a tu mascota?',
      `Tu reporte expira en ${diasRestantes} días. ¿Seguís buscando?`
    );
    
    // Actualizar fecha de último envío
    await reporte.update({ lastReminderSent: now });
  }

  console.log(`Recordatorios enviados: ${reportes.length}`);
  return new Response(JSON.stringify({ success: true, sent: reportes.length }), { status: 200 });
}