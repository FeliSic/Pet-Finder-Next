// report-expiry-warning/route.ts
import { Op } from 'sequelize';
import { PetsFind, Owner } from 'bknd/models/models';
import sendEmail from 'lib/nodemailer_email';

export async function GET() {
  // Reportes que vencen mañana (día 29)
  // TODO: completar cuando estén definidos los modelos Pets con campo active y asociación con Owner
  const desde = new Date(Date.now() - 29 * 24 * 60 * 60 * 1000);
  const hasta = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

  const reportes = await PetsFind.findAll({
    where: {
      createdAt: { [Op.between]: [desde, hasta] },
      active: true
    },
    include: [{ model: Owner, as: 'owner' }]
  });

  for (const reporte of reportes) {
    const owner = reporte.get('owner') as Owner;
    await sendEmail(
      owner.email,
      'Tu reporte expira mañana',
      `Tu reporte expira en 24hs. Podés renovarlo entrando a la app.`
    );
  }

  console.log(`Avisos de expiración enviados: ${reportes.length}`);
  return new Response(JSON.stringify({ success: true, sent: reportes.length }), { status: 200 });
}