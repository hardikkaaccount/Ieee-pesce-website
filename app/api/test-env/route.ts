import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only return values as masked strings for security
  return NextResponse.json({
    jwtsecret: process.env.JWT_SECRET ? "Set (length: " + process.env.JWT_SECRET.length + ")" : "Not set",
    adminUsername: process.env.ADMIN_USERNAME ? "Set (value: " + process.env.ADMIN_USERNAME + ")" : "Not set",
    adminPassword: process.env.ADMIN_PASSWORD ? "Set (length: " + process.env.ADMIN_PASSWORD.length + ")" : "Not set",
    // Include other expected env vars
    emailjs: process.env.NEXT_PUBLIC_EMAILJS_USER_ID ? "Set" : "Not set",
    nodes_env: process.env.NODE_ENV || "Not set"
  });
} 