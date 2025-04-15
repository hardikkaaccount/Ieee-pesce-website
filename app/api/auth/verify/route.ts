import { NextRequest, NextResponse } from 'next/server';
import * as jwt from 'jsonwebtoken';

// Get JWT secret from environment variables
// For production, use proper environment variables on your hosting platform
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key-change-me";

// POST /api/auth/verify - Verify a token
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 400 }
      );
    }
    
    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Check if the token is expired
      const currentTime = Math.floor(Date.now() / 1000);
      if (typeof decoded === 'object' && decoded.exp && decoded.exp < currentTime) {
        return NextResponse.json(
          { error: 'Token expired', isValid: false },
          { status: 401 }
        );
      }
      
      return NextResponse.json({
        isValid: true,
        user: typeof decoded === 'object' ? decoded : {}
      });
    } catch (tokenError) {
      return NextResponse.json(
        { error: 'Invalid token', isValid: false },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Token verification failed', isValid: false },
      { status: 500 }
    );
  }
} 