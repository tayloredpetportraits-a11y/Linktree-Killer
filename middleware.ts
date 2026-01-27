import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const hostname = request.headers.get('host') || '';
    const url = request.nextUrl;

    // 1. Define Main Domains (Where the App/Builder lives)
    const mainDomains = ['localhost', 'tayloredsolutions.ai', 'vercel.app'];

    // 2. Check if current hostname is a main domain
    const isMainDomain = mainDomains.some(domain => hostname.includes(domain));

    // 3. TRAFFIC CONTROL
    if (isMainDomain) {
        // If it's the main site, let them pass normally (to /builder, /api, etc.)
        return NextResponse.next();
    }

    // 4. THE REWRITE (For Custom Domains)
    // If we are here, the user is on "bio.tayloredpetportraits.com" (or similar).
    // We rewrite the URL behind the scenes to a special profile folder.
    // Example: bio.tayloredpetportraits.com -> /profiles/bio.tayloredpetportraits.com
    url.pathname = `/profiles/${hostname}${url.pathname}`;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /_static (inside /public)
         * 4. all root files inside /public (e.g. /favicon.ico)
         */
        "/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)",
    ],
};
