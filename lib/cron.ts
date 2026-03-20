// lib/cron.ts
// import cron from 'node-cron';
// import { Op } from 'sequelize';
// import { AuthOwner, Pets } from '../bknd/models/models';

// console.log('✅ Cron jobs iniciados');

// // Cada hora — limpia códigos expirados
// cron.schedule('0 * * * *', async () => {
//   console.log('🕐 Ejecutando limpieza de códigos expirados...');
//   const deleted = await AuthOwner.destroy({ where: { expiration: { [Op.lt]: new Date() } } });
//   console.log('Códigos expirados eliminados');
//   console.log(`🗑️ Códigos eliminados: ${deleted}`);
// });

// // Cada día a las 3am — limpia reportes de más de 1 mes
// cron.schedule('0 3 * * *', async () => {
//   console.log('🕐 Ejecutando limpieza de reportes antiguos...');
//   const deleted = await Pets.destroy({ where: { createdAt: { [Op.lt]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } } });
//   console.log('Reportes antiguos eliminados');
//   console.log(`🗑️ Reportes eliminados: ${deleted}`);
// });