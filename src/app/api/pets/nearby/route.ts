// app/api/pets/nearby/route.ts
import sequelizeClient from '../../../../../bknd/models/db';
import { QueryTypes } from 'sequelize';

const RADIUS_KM = 10;

export async function POST(request: Request) {
  const { latitude, longitude } = await request.json();

  const pets = await sequelizeClient.query(
    `
    SELECT *, 
      ST_Distance(
        ST_MakePoint(longitude, latitude)::geography,
        ST_MakePoint(:lng, :lat)::geography
      ) / 1000 AS distance_km
    FROM pets
    WHERE active = true
    AND ST_DWithin(
      ST_MakePoint(longitude, latitude)::geography,
      ST_MakePoint(:lng, :lat)::geography,
      :radius
    )
    ORDER BY distance_km ASC
    `,
    {
      replacements: {
        lat: latitude,
        lng: longitude,
        radius: RADIUS_KM * 1000 // PostGIS trabaja en metros
      },
      type: QueryTypes.SELECT
    }
  );

  console.log(`Reportes encontrados en ${RADIUS_KM}km: ${pets.length}`);

  return new Response(JSON.stringify({ success: true, pets }), { status: 200 });
}




// esto va en el frontend al apretar en Iniciar Geolocalizacion
navigator.geolocation.getCurrentPosition(async (position) => {
  const { latitude, longitude } = position.coords;
  
  const res = await fetch('/api/pets/nearby', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ latitude, longitude })
  });
  
  const data = await res.json();
  // data.pets → tarjetas de reportes cercanos
});