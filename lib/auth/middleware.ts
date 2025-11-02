// Auth middleware for Next.js API routes

import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from './auth';
import { JWTPayload } from '@/types';

/**
 * Middleware to protect admin routes
 */
export async function requireAuth(
  request: NextRequest
): Promise<{ authorized: boolean; user?: JWTPayload; response?: NextResponse }> {
  const token = request.cookies.get('fmc_admin_token')?.value;

  if (!token) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      ),
    };
  }

  const user = verifyJWT(token);

  if (!user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      ),
    };
  }

  return {
    authorized: true,
    user,
  };
}

/**
 * Higher-order function to wrap API routes with auth
 */
export function withAuth(
  handler: (request: NextRequest, user: JWTPayload) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const auth = await requireAuth(request);

    if (!auth.authorized) {
      return auth.response!;
    }

    return handler(request, auth.user!);
  };
}
