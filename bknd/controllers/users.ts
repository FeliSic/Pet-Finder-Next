import { Owner, AuthOwner } from '../models/models';
import { Op } from "sequelize";
import { generateToken, verifyToken } from "../../lib/jwt-auth";
import logger from "../../lib/winston-logger";
import parseBearerToken from "parse-bearer-token";


// Controlador para manejar el envío de emails con códigos de autenticación osea /auth con metodo POST


export const sendingEmail = async (req: Request) => {
  const body = await req.json()
  const name = body.name
  const email = body.email
  const allowLocationNotifications = body.allowLocationNotifications
  const telephone = body.telephone
  logger.debug(`Solicitud de envío de email recibida para: ${email}`);
  console.log(`Email obtenido: ${email}`);

  // Aquí iría la lógica para buscar/crear el registro en la base de datos
  let owner = await Owner.findOne({ where: { email } });

  if (!owner) {
    // Crear nuevo usuario
    try {
      owner = await Owner.create({ name, email, telephone, allowLocationNotifications });
      logger.debug(`Nuevo usuario creado: ${owner.name}, ${owner.email}, ${owner.telephone}`);
    } catch (error) {
      logger.error('Error al crear el usuario:', error);
      return new Response(JSON.stringify({ success: false, error: 'Error al crear el usuario' }), { status: 500 });
    }
    } else {
    // ✅ Solo actualizar allowLocationNotifications (sin tocar name, email, telephone)
    await owner.update({ allowLocationNotifications });
    logger.debug(`Usuario actualizado: allowLocationNotifications = ${allowLocationNotifications}`);
  }
  
   // Verificar si ya hay un código válido para este usuario
  const existingAuth = await AuthOwner.findOne({
    where: {
      userId: owner.id,
      expiration: { [Op.gt]: new Date() }, // que no esté vencido
    },
  });
  logger.debug(`Registro de autenticación existente: ${existingAuth}`);
  if (existingAuth) {
    logger.warn(`Ya existe un código activo para el usuario ID: ${owner.id}`);
    return new Response(JSON.stringify({ success: true, message: 'Ya existe un código activo, revisá tu email' }), { status: 429 });
  }


  // si no existe va la lógica para generar el código de autenticación
  const code = generateToken(owner.id, '15m');
  logger.debug(`Código generado: ${code}`);
  // almacenarlo en la base de datos (tabla Auth)  
  const authRecord = await AuthOwner.create({
    userId: owner.id,
    code,
    expiration: new Date(Date.now() + 15 * 60 * 1000), // 15 mins desde ahora
  });
  logger.debug(`Código almacenado en la base de datos para el usuario ID: ${owner.id}`, authRecord);
  // Aquí iría la lógica para enviar el email con el código
  // y enviar el código por email.
  // await sendEmail(email, 'Tu código de autenticación', `Tu código es: ${code}`);
  logger.debug(`codigo enviado al email: ${email}`);
  // Al final, envías una respuesta
  return new Response(JSON.stringify({ success: true,  message: "Email procesado correctamente." }), { status: 200});
};

// ---------------------------------------------------------------------------------------------

// Controlador para manejar la verificación del código de autenticación osea /auth/token con metodo POST

export async function verifyAuthCode(request: Request) {
  const { email, code } = await request.json();
  logger.debug(`Verificando código para email: ${email} con código: ${code}`);

  const owner = await Owner.findOne({ where: { email } });
  if (!owner) {
    logger.warn(`Usuario no encontrado durante la verificación del código: ${email}`);
    return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
  }
  logger.debug(`Usuario encontrado: ${owner}`);

  const authRecord = await AuthOwner.findOne({
    where: {
      userId: owner.id,
      code,
      expiration: { [Op.gt]: new Date() },
    },
  });
  logger.debug(`Registro de autenticación encontrado: ${authRecord}`);

  if (!authRecord) {
    return new Response(JSON.stringify({ message: 'Código inválido o expirado' }), { status: 400 });
  }

  const token = generateToken(owner.id, '2h');
  logger.debug(`Código verificado. Token generado para el usuario ID: ${owner.id}`, token);

  return new Response(JSON.stringify({ token, email: owner.email, userId: owner.id }), { status: 200 });
}

// ---------------------------------------------------------------------------------------------

// Controlador para manejar la obtención de la información del usuario en cuestión a travez de una request con un token. Es /me con metodo GET
import { IncomingMessage } from 'http';
function createIncomingMessage(request: Request): IncomingMessage {
  const headers: { [key: string]: string } = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  return {
    headers,
    // Agrega otras propiedades necesarias de IncomingMessage si es necesario
    // Por ejemplo, puedes agregar `method`, `url`, etc.
  } as IncomingMessage;
}


export async function getMe(request: Request) {
  const incomingMessage = createIncomingMessage(request);
  
  // Usar la función de la librería con el header
  const token = parseBearerToken(incomingMessage);
  console.log('Token extraído con parseBearerToken:', token);
  logger.debug(`Token extraído con parse-bearer-token: ${token}`);

  if (!token) {
    logger.warn(`Token incorrecto o ausente durante la obtención de información del usuario: ${token}`);
    return new Response(JSON.stringify({ message: 'Token incorrecto' }), { status: 401 });
  }

  const tokenData = verifyToken(token);
  logger.debug(`Datos del token verificado: ${tokenData}`);

  if (!tokenData || typeof tokenData === 'string') {
    logger.error(`Token inválido durante la obtención de información del usuario: ${tokenData}`);
    return new Response(JSON.stringify({ message: 'Token inválido' }), { status: 401 });
  }

  const userId = tokenData.id;
  logger.debug(`Token verificado para el usuario ID: ${userId}`);

  const owner = await Owner.findByPk(userId, {
    attributes: ['id', 'email', 'telephone', 'createdAt', 'updatedAt'],
  });

  if (!owner) {
    logger.error(`Usuario no encontrado: ${owner}`);
    return new Response(JSON.stringify({ message: 'Usuario no encontrado' }), { status: 404 });
  }

  logger.debug(`Información del usuario encontrada: ${owner}`);

  return new Response(JSON.stringify({ owner }), { status: 200 });
}
// ---------------------------------------------------------------------------------------------

// Controlador para modificar algunos datos del usuario al que pertenezca el token. Es /me con metodo PATCH

// export const updateMe = async (req: NextApiRequest, res: NextApiResponse) => {
//   const token = parseBearerToken(req);
//   logger.debug(`Token extraído con parse-bearer-token: ${token}`);
//   if (!token) {
//     logger.warn(`Token incorrecto o ausente durante la actualización del usuario: ${token}`);
//     return res.status(401).json({ message: 'Token incorrecto' });
//   }
//     // Verificar el token
//   const tokenData = verifyToken(token);
//   logger.debug(`Datos del token verificado: ${tokenData}`);
//   if (!tokenData) {
//     logger.error(`Token inválido durante la actualización del usuario: ${tokenData}`);
//     return res.status(401).json({ message: 'Token inválido' });
//   }
//   if (!tokenData || typeof tokenData === 'string') {
//     throw new Error("Token inválido");
//   }
//    // Obtener el userId del token verificado
//   const userId = tokenData.id;
//   logger.debug(`Token verificado para el usuario ID: ${userId}`);
//   // Buscar el usuario en la base de datos
//   const owner = await Owner.findByPk(userId);
//   if (!owner) {
//     logger.error(`Usuario no encontrado: ${owner} y su id: ${userId}`);
//     return res.status(404).json({ message: `Usuario no encontrado: ${owner} y su id: ${userId}` });
//   }
//   logger.debug(`Usuario encontrado para actualización: ${owner}`);
//   // Actualizar los datos del usuario (por ejemplo, el nombre)
//   const { name, email } = req.body;
//   const isValidEmail = (email: string) => {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// };

// if (email && !isValidEmail(email)) {
//   logger.warn(`Intento de actualización con email inválido: ${email}`);
//   return res.status(400).json({ message: 'Email inválido' });
// }

//   if (name) owner.name = name;
//   if (email && isValidEmail(email)) owner.email = email;
//   // Si hay un campo de dirección, actualizalo
//   await owner.save();
//   logger.debug(`Usuario actualizado: ${owner}`);
//   // Enviar la información actualizada del usuario en la respuesta
//   res.status(200).json({ owner });
// }

