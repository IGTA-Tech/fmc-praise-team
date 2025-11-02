// API Route: /api/auth/verify
// Verify JWT token

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth/auth';
import { JWT_CONFIG } from '@/lib/utils/constants';

// GET /api/auth/verify - Verify token
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(JWT_CONFIG.COOKIE_NAME)?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const payload = verifyJWT(token);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: payload.userId,
        username: payload.username,
      },
    });
  } catch (error: any) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { success: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}

// POST /api/auth/logout - Logout
export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });

  response.cookies.delete(JWT_CONFIG.COOKIE_NAME);

  return response;
}
