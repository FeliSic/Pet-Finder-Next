import { PetsFind } from 'bknd/models/models';
import { geocodeAddress } from 'lib/geocoding';
import cloudinary from 'lib/cloudinary';

export async function createReport(req: Request) {
  const formData = await req.formData();

  const file = formData.get('image') as File;
  const userId = formData.get('userId') as string;
  const userEmail = formData.get('userEmail') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const lastSeen = formData.get('lastSeen') as string;
  const petStatus = formData.get('petStatus') as string ?? 'pending';
 

  // Después de obtener formData
  // Geocodificar dirección
  let lat: number, lng: number;

  const latRaw = formData.get('latitude');
  const lngRaw = formData.get('longitude');

  if (latRaw && lngRaw) {
  lat = parseFloat(latRaw as string);
  lng = parseFloat(lngRaw as string);
  } else {
  const lastSeen = formData.get('lastSeen') as string;
  const coords = await geocodeAddress(lastSeen);
  if (!coords) {
    return new Response(
      JSON.stringify({ success: false, error: 'No se pudo geocodificar la dirección' }),
      { status: 400 }
    );
  }
  lat = coords.latitude;
  lng = coords.longitude;
  }

  // Subir imagen a Cloudinary
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const upload = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { folder: 'pet-finder' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(buffer);
  });

  const imageUrl = (upload as any).secure_url;

  


  console.log({ userId, userEmail, name, description, petStatus, lastSeen, lat, lng, imageUrl });
  // Crear reporte en DB
  const pet = await PetsFind.create({
    userId: Number(userId),
    userEmail,
    name,
    description,
    petStatus,
    lastSeen,
    active: true,
    latitude: lat,
    longitude: lng,
    imageUrl,
  });

  return new Response(JSON.stringify({ success: true, pet }), { status: 201 });
}




// export async function POST(request: Request) {
//   const formData = await request.formData();
//   const file = formData.get('image') as File;
  
//   // Convertir a buffer y subir a Cloudinary
//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);
  
//   const upload = await new Promise((resolve, reject) => {
//     cloudinary.uploader.upload_stream(
//       { folder: 'pet-finder' }, // carpeta en Cloudinary
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result);
//       }
//     ).end(buffer);
//   });

//   const imageUrl = (upload as any).secure_url; // URL pública de la imagen

//   // Crear el reporte en la DB con la URL
//   // const pet = await Pets.create({
//   //   // userId: ...,
//   //   // userEmail: ...,
//   //   // petStatus: 'pending',
//   //   // lastSeen: ...,
//   //   // active: true,
//   //   // imageUrl // guardás la URL en la DB
//   // });

//   // return new Response(JSON.stringify({ success: true, pet }), { status: 201 });
// }
