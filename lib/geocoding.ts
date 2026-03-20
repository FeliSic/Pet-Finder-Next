// lib/geocoding.ts
export async function geocodeAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      'User-Agent': 'pet-finder-app/1.0' // Nominatim requiere un User-Agent
    }
  });

  const data = await res.json();

  if (!data || data.length === 0) {
    console.warn(`No se encontraron coordenadas para: ${address}`);
    return null;
  }

  console.log(`✅ Geocoding exitoso para: ${address} → lat: ${data[0].lat}, lng: ${data[0].lon}`);

  return {
    latitude: parseFloat(data[0].lat),
    longitude: parseFloat(data[0].lon)
  };
}