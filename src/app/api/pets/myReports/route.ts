import { Pets } from "bknd/models/models";

export async function GET(request: Request) {
  const userIdRaw = request.headers.get('userId');
  
  if (!userIdRaw) {
    return new Response(JSON.stringify({ success: false, error: 'userId requerido' }), { status: 400 });
  }

  const userId = Number(userIdRaw);
  const pets = await Pets.findAll({ where: { userId } });
  return new Response(JSON.stringify({ success: true, pets }), { status: 200 });
}