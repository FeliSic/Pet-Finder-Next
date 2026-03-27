// app/api/pets/nearby/route.ts
// app/api/pets/nearby/route.ts
// app/api/pets/nearby/route.ts
import { NextResponse } from 'next/server';
import { PetsFind } from 'bknd/models/models';
import { Op, literal } from 'sequelize';
import sequelize from 'bknd/models/db'; // asegúrate que exporta la instancia

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '');
  const lng = parseFloat(searchParams.get('lng') || '');
  const radius = parseInt(searchParams.get('radius') || '500');

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: 'Coordenadas inválidas' }, { status: 400 });
  }

  try {
    const pets = await PetsFind.findAll({
      where: {
        active: true,
        [Op.and]: literal(
          `ST_DWithin(
            ST_SetSRID(ST_MakePoint(longitude, latitude), 4326),
            ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
            ${radius}
          )`
        )
      },
      attributes: ['id', 'name', 'description', 'imageUrl', 'lastSeen', 'latitude', 'longitude'],
    });

    return NextResponse.json({ success: true, pets });
  } catch (error) {
    console.error('Error en nearby:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}