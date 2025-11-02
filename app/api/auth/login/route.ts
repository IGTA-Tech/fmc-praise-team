// API Route: /api/auth/login
// Admin login with JWT

import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateJWT } from '@/lib/auth/auth';
import { loginSchema } from '@/types';
import { JWT_CONFIG } from '@/lib/utils/constants';

// POST /api/auth/login - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const { username, password } = loginSchema.parse(body);

    // In production, fetch from database
    // For now, using environment variables
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminPasswordHash) {
      return NextResponse.json(
        { success: false, error: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    // Check username
    if (username !== adminUsername) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, adminPasswordHash);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT
    const token = generateJWT({
      userId: 'admin-1',
      username: adminUsername,
    });

    // Set cookie
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
    });

    response.cookies.set(JWT_CONFIG.COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: JWT_CONFIG.COOKIE_MAX_AGE,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Login failed' },
      { status: 500 }
    );
  }
}
