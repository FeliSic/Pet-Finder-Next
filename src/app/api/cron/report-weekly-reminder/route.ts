// report-weekly-reminder/route.ts
import { Op } from 'sequelize';
import { Pets, Owner } from 'bknd/models/models';
import sendEmail from 'lib/nodemailer_email';

export async function GET() {
  // Reportes creados hace 7, 14, 21 días (múltiplos de 7)
  // TODO: completar cuando estén definidos los modelos Pets con campo active y asociación con Owner
  const reportes = await Pets.findAll({
    where: {
      createdAt: {
        [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      active: true
    },
    include: [{ model: Owner, as: 'owner' }]
  });

  for (const reporte of reportes) {
    const owner = reporte.get('owner') as Owner;
    const diasRestantes = 30 - Math.floor((Date.now() - new Date(reporte.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    await sendEmail(
      owner.email,
      '¿Seguís buscando a tu mascota?',
      `Tu reporte expira en ${diasRestantes} días. ¿Seguís buscando?`
    );
  }

  console.log(`Recordatorios enviados: ${reportes.length}`);
  return new Response(JSON.stringify({ success: true, sent: reportes.length }), { status: 200 });
}