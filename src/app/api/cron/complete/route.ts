import { NextResponse } from 'next/server';
import { PetsFind } from 'bknd/models/models';

export async function POST(request: Request) {
  const { reportId, userId } = await request.json();

    if (!reportId || !userId) {
        return NextResponse.json({ success: false, error: 'Faltan reportId o userId' }, { status: 400 });
    }


  // Buscar el reporte
    const report = await PetsFind.findByPk(reportId);
    if (!report) {
        return NextResponse.json({ success: false, error: 'Reporte no encontrado' }, { status: 404 });
    }

    // Verificar que el userId coincida con el dueño del reporte
    if (report.userId !== Number(userId)) {
        return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 403 });
    }

  // Eliminar el reporte
  await report.destroy();

  return NextResponse.json({ success: true });
}