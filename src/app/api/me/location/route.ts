// app/api/user/location/route.ts
import { NextResponse } from 'next/server';
import { UserLocation } from 'bknd/models/models';

export async function POST(req: Request) {
  const { userId, latitude, longitude } = await req.json();
  if (!userId || latitude === undefined || longitude === undefined) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
  }

  await UserLocation.upsert({ userId: Number(userId), latitude, longitude });
  return NextResponse.json({ success: true });
}   