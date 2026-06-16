import { NextResponse } from "next/server";

export async function GET() {
  const backendSecret = process.env.BACKEND_JWT_SECRET || "a-very-secure-secret-shared-with-express";
  return NextResponse.json({ 
    secretFirstChars: backendSecret.substring(0, 10) + '...',
    secretLength: backendSecret.length,
    secretFull: backendSecret // احذف السطر ده قبل النشر للإنتاج
  });
}