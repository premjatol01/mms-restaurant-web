import { NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl;

  // Get hostname without port (e.g., 'urbancafe.localhost' or 'localhost')
  const hostname = req.headers.get('host') || '';
  const currentHost = hostname.split(':')[0].toLowerCase();

  // If it's a fallback URL like /restaurant/6abb.../menu/TBL-4
  if (url.pathname.startsWith('/restaurant/')) {
    const parts = url.pathname.split('/');
    if (parts.length >= 3) {
      const restId = parts[2];
      const restOfPath = parts.slice(3).join('/');
      return NextResponse.rewrite(new URL(`/${restId}/${restOfPath}`, req.url));
    }
  }

  // Determine root domain from environment with sensible default
  const envRootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    process.env.ROOT_DOMAIN ||
    'localhost'
  ).toLowerCase();

  // Root domains that serve the main marketing website
  const isRootDomain =
    currentHost === envRootDomain ||
    currentHost === `www.${envRootDomain}` ||
    currentHost === 'localhost' ||
    currentHost === '127.0.0.1';

  if (isRootDomain) {
    return NextResponse.next();
  }

  // Extract subdomain dynamically based on configured root domain or localhost
  let subdomain = '';
  if (currentHost.endsWith(`.${envRootDomain}`)) {
    subdomain = currentHost.slice(0, -(envRootDomain.length + 1));
  } else if (currentHost.endsWith('.localhost')) {
    subdomain = currentHost.slice(0, -'.localhost'.length);
  } else {
    subdomain = currentHost.split('.')[0];
  }

  // If subdomain is empty or www, treat as root domain
  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  // Rewrite the URL to point to our dynamic [subdomain] folder
  // So / becomes /[subdomain] and /menu becomes /[subdomain]/menu
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
