// app/api/auth.ts

import { sendingEmail } from 'bknd/controllers/users';

export async function POST(request: Request) {
  // Pasás el request completo a sendingEmail
    return await sendingEmail(request);
}

