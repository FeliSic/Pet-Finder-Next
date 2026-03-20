const DATABASE_URL = process.env.SEQUELIZE_URL;

console.log(process.env.SEQUELIZE_URL)

if (!DATABASE_URL) {
  throw new Error('SEQUELIZE_URL no está definida en las variables de entorno');
}

import {Sequelize} from "sequelize"
import pg from "pg"; // ✅ Importá pg

const sequelizeClient = new Sequelize(DATABASE_URL, {
  dialect: 'postgres',
  dialectModule: pg, // ✅ Forzá el módulo pg
});

async function testConnection() {
  try {
    await sequelizeClient.authenticate();
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('No se pudo conectar:', error);
  }
}

testConnection();

import '../../lib/cron';

export default sequelizeClient;