import { NextResponse } from 'next/server';
import { PetsFind, Owner } from 'bknd/models/models';
import { sendFoundPetEmail } from 'lib/resend_emails';

export async function POST(req: Request) {
  const userId = req.headers.get('userId');
  const { reportId, message } = await req.json();

  if (!userId || !reportId || !message) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const report = await PetsFind.findByPk(reportId);
  if (!report) {
    return NextResponse.json({ error: 'Reporte no encontrado' }, { status: 404 });
  }

  const owner = await Owner.findByPk(report.userId);
  const informant = await Owner.findByPk(Number(userId));

  if (!owner || !informant) {
    return NextResponse.json({ error: 'Usuarios no encontrados' }, { status: 404 });
  }

  try {
    await sendFoundPetEmail({
      ownerEmail: owner.email,
      ownerName: owner.name,
      petName: report.name,
      informantName: informant.name,
      informantEmail: informant.email,
      informantPhone: informant.telephone,
      message,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    return NextResponse.json({ error: 'Error al enviar email' }, { status: 500 });
  }
}