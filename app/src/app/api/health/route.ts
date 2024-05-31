import { NextRequest, NextResponse } from 'next/server';

export const GET = (_: NextRequest) =>
  NextResponse.json({ status: 'OK' }, { status: 200 });
