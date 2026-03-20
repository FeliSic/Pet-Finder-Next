// cleanup-auth/route.ts
import { Op } from 'sequelize';
import { AuthOwner } from 'bknd/models/models';

export async function GET() {
  const deleted = await AuthOwner.destroy({
    where: { expiration: { [Op.lt]: new Date() } }
  });
  console.log(`Códigos eliminados: ${deleted}`);
  return new Response(JSON.stringify({ success: true, deleted }), { status: 200 });
}