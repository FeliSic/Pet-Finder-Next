// cleanup-reports/route.ts
import { Op } from 'sequelize';
import { PetsFind } from 'bknd/models/models';

export async function GET() {
  const expiredDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Primero marca como inactivos
  await PetsFind.update(
    { active: false },
    { where: { createdAt: { [Op.lt]: expiredDate }, active: true } }
  );

  // Luego elimina
  const deleted = await PetsFind.destroy({
    where: { createdAt: { [Op.lt]: expiredDate } }
  });

  console.log(`Reportes eliminados: ${deleted}`);
  return new Response(JSON.stringify({ success: true, deleted }), { status: 200 });
}