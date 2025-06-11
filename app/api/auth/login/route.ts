import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

// Get credentials from environment variables
// For production, use proper environment variables on your hosting platform
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-me";

// Hardcoded credentials as fallback (CHANGE THESE BEFORE DEPLOYING)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// For debugging - remove in production
console.log("Using credentials:");
console.log(`ADMIN_USERNAME: ${ADMIN_USERNAME}`);
console.log(`ADMIN_PASSWORD: ${ADMIN_PASSWORD}`);

// POST /api/auth/login - Login as admin
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    // For debugging - remove in production
    console.log("Login attempt:");
    console.log(`Entered username: ${username}`);
    console.log(`Entered password: ${password}`);
    console.log(`Username match: ${username === ADMIN_USERNAME}`);
    console.log(`Password match: ${password === ADMIN_PASSWORD}`);
    
    // Validate credentials
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
    // Create token
    const now = new Date();
    const expiryTime = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 hour expiry
    
    const payload = {
      username: username,
      admin: true,
      iat: Math.floor(now.getTime() / 1000),
      exp: Math.floor(expiryTime.getTime() / 1000)
    };
    
    // In a production environment, you'd use a proper JWT library
    // and store the token securely with HTTP-only cookies
    const token = jwt.sign(payload, JWT_SECRET);
    
    return NextResponse.json({
      success: true,
      token,
      expiryTime: expiryTime.toISOString()
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
} 