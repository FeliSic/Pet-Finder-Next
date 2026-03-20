// lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

// Verificar conexión
cloudinary.api.ping()
  .then(() => console.log('✅ Cloudinary conectado'))
  .catch((err) => console.error('❌ Error conectando Cloudinary:', err));

export default cloudinary;