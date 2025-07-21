import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  await supabase.auth.getSession();

  // Disable CSP in development to allow all images
  if (process.env.NODE_ENV === 'development') {
    res.headers.delete('Content-Security-Policy');
    res.headers.delete('X-Content-Security-Policy');
    console.log('CSP disabled for development');
  }

  return res;
}

// Ensure middleware runs on all relevant routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};