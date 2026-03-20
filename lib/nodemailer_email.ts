import nodemailer from 'nodemailer';

const sendEmail = async (to: any, subject: any, text: any) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net', // Cambia esto por tu servidor SMTP
    port: 587, // O el puerto que uses
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: 'apikey', // Tu email
      pass: process.env.SENDGRID_API_KEY, // Tu contraseña
    },
  });

  const mailOptions = {
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@yourdomain.com', // Email de origen
    to,
    subject,
    text,
  };

try {
  await transporter.sendMail(mailOptions);
  console.log('Email enviado correctamente');
} catch (error: any) {
  if (error.response && error.response.statusCode === 429) {
    console.error('Demasiadas solicitudes, intenta más tarde.');
    // Implementar lógica para esperar y reintentar si es necesario
  } else {
    console.error('Error al enviar el email:', error);
    } 
  }
}

export default sendEmail;