// app/api/me.ts
import { getMe } from 'bknd/controllers/users';

export async function GET(request: Request) {
    return await getMe(request);
}
