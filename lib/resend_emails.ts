// lib/resend_emails.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);


// aviso de encontrado al dueño--------------------------------------------------------------------------------------------------------------------------------------------------------------

export async function sendFoundPetEmail({
  ownerEmail,
  ownerName,
  petName,
  informantName,
  informantEmail,
  informantPhone,
  message,
}: {
  
  ownerEmail: string;
  ownerName: string;
  petName: string;
  informantName: string;
  informantEmail: string;
  informantPhone?: string;
  message: string;
}) {
    // Si estamos en desarrollo, simulamos el envío
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 MOCK EMAIL (no enviado realmente)');
    console.log('Para:', ownerEmail);
    console.log('Asunto:', `🐾 Alguien tiene información sobre ${petName}`);
    console.log('Contenido:', `
      ¡Hola ${ownerName}!
      ${informantName} ha dado aviso sobre tu mascota ${petName}.
      Mensaje: ${message}
      Contacto: ${informantEmail} ${informantPhone ? `- ${informantPhone}` : ''}
    `);
    return; // Simula éxito
  }
  const from = 'PetFinder <notificaciones@tudominio.com>'; // Cambia por tu dominio

  const html = `
    <h2>¡Hola ${ownerName}!</h2>
    <p><strong>${informantName}</strong> ha dado aviso sobre tu mascota <strong>${petName}</strong>.</p>
    <p><strong>Mensaje:</strong> ${message}</p>
    <p><strong>Contacto del informante:</strong> ${informantEmail} ${informantPhone ? `- ${informantPhone}` : ''}</p>
    <p>Podés contactarlo directamente para obtener más detalles.</p>
    <p>Gracias por usar PetFinder.</p>
  `;

  await resend.emails.send({
    from,
    to: ownerEmail,
    subject: `🐾 Alguien tiene información sobre ${petName}`,
    html,
  });
}

// Recordatorio de expiración cada 7 dias--------------------------------------------------------------------------------------------------------------------------------------------------------------

// Email para recordatorio semanal / de expiración
export async function sendExpirationReminderEmail({
  ownerEmail,
  ownerName,
  petName,
  daysRemaining,
}: {
  ownerEmail: string;
  ownerName: string;
  petName: string;
  daysRemaining: number;
}) {
  const isExpiringSoon = daysRemaining === 1;
  const subject = isExpiringSoon
    ? `⚠️ Tu reporte de ${petName} expira mañana`
    : `📢 Recordatorio: tu reporte de ${petName} expira en ${daysRemaining} días`;

  // Mock en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 MOCK EMAIL (recordatorio)');
    console.log('Para:', ownerEmail);
    console.log('Asunto:', subject);
    console.log('Contenido:', `
      Hola ${ownerName},
      Tu reporte de ${petName} ${isExpiringSoon ? 'expira mañana' : `expira en ${daysRemaining} días`}.
      Si aún no encontraste a tu mascota, podés renovarlo desde la sección "Mis reportes".
      Si ya la encontraste, marcá el reporte como completado.
    `);
    return;
  }

  const from = 'PetFinder <notificaciones@tudominio.com>'; // mismo remitente que en el otro email

  const html = `
    <h2>¡Hola ${ownerName}!</h2>
    <p>Tu reporte de <strong>${petName}</strong> ${isExpiringSoon ? 'expira mañana' : `expira en ${daysRemaining} días`}.</p>
    <p>Si aún no encontraste a tu mascota, podés renovar el reporte desde la sección "Mis reportes" en PetFinder.</p>
    <p>Si ya la encontraste, no olvides marcar el reporte como completado.</p>
    <p>Gracias por confiar en PetFinder.</p>
  `;

  await resend.emails.send({
    from,
    to: ownerEmail,
    subject,
    html,
  });
}

// Reportes cercanos por busqueda pasiva --------------------------------------------------------------------------------------------------------------------------------------------------------------

export async function sendNearbyReportEmail({
  userEmail,
  userName,
  reports,
  reportCount
}: {
  userEmail: string;
  userName: string;
  reports: any[];
  reportCount: number;
}) {
  // Mock en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('📧 MOCK EMAIL (nuevos reportes cerca)');
    console.log('Para:', userEmail);
    console.log('Asunto:', `🐾 ${reportCount} nuevo(s) reporte(s) cerca de tu zona`);
    console.log('Contenido:', `
      Hola ${userName},
      Hay ${reportCount} reporte(s) de mascotas perdidas cerca de tu zona:
      ${reports.map(r => `- ${r.name} (visto en ${r.lastSeen})`).join('\n')}
      Podés verlos en PetFinder y dar aviso si los encuentras.
    `);
    return;
  }

  const from = 'PetFinder <notificaciones@tudominio.com>';
  const reportList = reports.map(r => `<li><strong>${r.name}</strong> - última vez: ${r.lastSeen}</li>`).join('');
  const html = `
    <h2>¡Hola ${userName}!</h2>
    <p>Hay <strong>${reportCount}</strong> nuevo(s) reporte(s) de mascotas perdidas cerca de tu zona:</p>
    <ul>${reportList}</ul>
    <p>Podés ingresar a PetFinder para ver los detalles y dar aviso si tienes información.</p>
    <p>¡Gracias por ayudar!</p>
  `;

  await resend.emails.send({
    from,
    to: userEmail,
    subject: `🐾 ${reportCount} nuevo(s) reporte(s) cerca de tu zona`,
    html,
  });
}

// --------------------------------------------------------------------------------------------------------------------------------------------------------------