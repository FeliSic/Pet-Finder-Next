// app/api/auth/token.ts
import { verifyAuthCode } from 'bknd/controllers/users';

export async function POST(request: Request) {
    return await verifyAuthCode(request);
}