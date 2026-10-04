import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;
  
  // Get hostname (e.g., 'urbancafe.localhost:3000' or 'localhost:3000')
  const hostname = req.headers.get('host') || '';
  const currentHost = hostname.split(':')[0];

  // If it's a fallback URL like /restaurant/6abb.../menu/TBL-4
  if (url.pathname.startsWith('/restaurant/')) {
    // Extract the restaurant ID and the rest of the path
    const parts = url.pathname.split('/');
    // parts = ['', 'restaurant', '6abb...', 'menu', 'TBL-4']
    if (parts.length >= 3) {
      const restId = parts[2];
      const restOfPath = parts.slice(3).join('/');
      return NextResponse.rewrite(new URL(`/${restId}/${restOfPath}`, req.url));
    }
  }

  // If we are on the main domain and not a /restaurant/ path
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
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
