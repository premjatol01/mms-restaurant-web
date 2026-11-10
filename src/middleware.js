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
  const isRootDomain = currentHost === envRootDomain || currentHost === `www.${envRootDomain}`;

  // ── PATH-BASED routing on localhost (dev) ──────────────────────────────────
  // localhost:3000/restaurant         → app/[subdomain]/page.jsx (slug = "restaurant")
  // localhost:3000/restaurant/preview → app/[subdomain]/preview/page.jsx
  // localhost:3000/                   → app/(main)/page.jsx  (marketing)
  // localhost:3000/login              → app/(main)/login/page.jsx
  if (isLocalhost) {
    // Next.js file-system routing handles [subdomain] naturally for path-based slugs.
    // We just need to make sure reserved app paths are NOT treated as restaurant slugs.
    // Since Next.js resolves (main)/login before [subdomain]/page, no rewrite needed.
    return NextResponse.next();
  }

  // ── SUBDOMAIN-BASED routing on production ──────────────────────────────────
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

  // Rewrite subdomain.domain.com/path → /subdomain/path
  return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
