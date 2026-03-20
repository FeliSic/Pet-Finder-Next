// // app/api/MyReports/route.ts
// import { Pets } from 'bknd/models/models';
// import { geocodeAddress } from 'lib/geocoding';
// import cloudinary from 'lib/cloudinary';

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

// // app/api/pets/route.ts
// export async function POST(request: Request) {
//   const body = await request.json();
//   const { userId, userEmail, lastSeen, petStatus } = body;

//   // Geocodificar la dirección
//   const coords = await geocodeAddress(lastSeen);

//   if (!coords) {
//     return new Response(
//       JSON.stringify({ success: false, error: 'No se pudo geocodificar la dirección' }),
//       { status: 400 }
//     );
//   }

//   const pet = await Pets.create({
//     userId,
//     userEmail,
//     petStatus,
//     lastSeen,
//     active: true,
//     latitude: coords.latitude,
//     longitude: coords.longitude
//   });

//   return new Response(JSON.stringify({ success: true, pet }), { status: 201 });
// }