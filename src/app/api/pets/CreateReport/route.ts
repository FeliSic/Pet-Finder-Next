// // app/api/pets/MyReports/route.ts
import { createReport } from 'bknd/controllers/createReport';

export async function POST(request: Request) {
  return await createReport(request);
}