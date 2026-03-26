import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');
  if (!address) {
    return NextResponse.json({ error: 'Falta dirección' }, { status: 400 });
  }

  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'pet-finder-app/1.0' },
  });
  const data = await res.json();

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'No se encontraron coordenadas' }, { status: 404 });
  }

  return NextResponse.json({
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon),
  });
}