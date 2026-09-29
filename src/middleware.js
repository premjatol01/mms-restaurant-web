import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  
  // Get hostname (e.g., 'urbancafe.localhost:3000' or 'localhost:3000')
  const hostname = req.headers.get('host') || '';

  // Remove port for the check
  const currentHost = hostname.split(':')[0];

  // If we are on the main domain
  if (currentHost === 'localhost' || currentHost === 'ourdomain.com') {
    return NextResponse.next();
  }

  // If it's a subdomain (e.g. urbancafe.localhost)
  const subdomain = currentHost.split('.')[0]; 

  // Rewrite the URL to point to our dynamic [subdomain] folder
  // So /menu becomes /[subdomain]/menu
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
