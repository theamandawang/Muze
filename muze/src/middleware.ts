import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

type Token = {
    name: string | null | undefined,
    email: string | null | undefined,
    picture: string | null | undefined,
    sub: string | null | undefined,
    access_token: string | null | undefined,
    token_type: string | null | undefined,
    expires_at: number | null | undefined,
    expires_in: number | null | undefined,
    refresh_token: string | null | undefined,
    scope: string | null | undefined,
    id: string | null | undefined,
    iat: number | null | undefined,
    exp: number | null | undefined,
    jti: string | null | undefined,
}

export async function middleware(req: NextRequest) {
    const session = (await getToken({ req, secret })) as Token;
    const { pathname } = req.nextUrl;

    if (req.nextUrl.pathname.startsWith('/_next')) {
        return NextResponse.next();
    }

    if (pathname === '/' && session && session.exp && session.exp > Date.now() / 1000) {
        return NextResponse.redirect(new URL('/home', req.url));
    } else if(pathname.startsWith('/api/auth')) {
        // do nothing.
    }
    else if (pathname !== '/' && (!session || !session.exp || session.exp < Date.now() / 1000)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}
