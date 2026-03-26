import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  if (!lat || !lng) {
    return NextResponse.json({ error: 'Faltan coordenadas' }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'pet-finder-app/1.0' },
  });
  const data = await res.json();

  if (data && data.display_name) {
    return NextResponse.json({ address: data.display_name });
  }
  return NextResponse.json({ error: 'No se encontró dirección' }, { status: 404 });
}