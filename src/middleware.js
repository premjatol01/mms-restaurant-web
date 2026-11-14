import { NextResponse } from 'next/server';

// These path prefixes belong to the Next.js app itself — never treat them as restaurant slugs
const RESERVED_PATHS = new Set([
  '', 'login', 'forgot-password', 'reset-password', 'setup-password',
  '_next', 'api', 'favicon.ico',
]);

export function middleware(req) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';
  const currentHost = hostname.split(':')[0].toLowerCase();

  const envRootDomain = (
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ||
    process.env.ROOT_DOMAIN ||
    'localhost'
  ).toLowerCase();

  const isLocalhost = currentHost === 'localhost' || currentHost === '127.0.0.1';

  // Detect shared free hosting platforms (Vercel, Render) where wildcard DNS is not available
  const isVercelOrRender =
    currentHost.endsWith('.vercel.app') ||
    currentHost.endsWith('.onrender.com');

  const isForcedPathMode =
    process.env.NEXT_PUBLIC_ROUTING_MODE === 'path' ||
    process.env.ROUTING_MODE === 'path';

  // ── 1. PATH-BASED ROUTING (Localhost, Vercel, Render, or Forced Path Mode) ──
  // URL format: https://tablly-web.vercel.app/[subdomain]/menu/[id]
  // Next.js maps [subdomain] directly to the folder route parameter.
  // No host rewrites needed!
  if (isLocalhost || isVercelOrRender || isForcedPathMode) {
    return NextResponse.next();
  }

  // ── 2. WILDCARD SUBDOMAIN ROUTING (Custom domain e.g. tablly.com) ───────────
  const isRootDomain = currentHost === envRootDomain || currentHost === `www.${envRootDomain}`;
  if (isRootDomain) {
    return NextResponse.next();
  }

  let subdomain = '';
  if (currentHost.endsWith(`.${envRootDomain}`)) {
    subdomain = currentHost.slice(0, -(envRootDomain.length + 1));
  } else if (currentHost.endsWith('.localhost')) {
    subdomain = currentHost.slice(0, -'.localhost'.length);
  } else {
    subdomain = currentHost.split('.')[0];
  }

  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  // Rewrite subdomain.tablly.com/menu/... → /[subdomain]/menu/...
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
