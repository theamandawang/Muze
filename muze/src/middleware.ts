import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
    const session = await getToken({ req, secret });
    const { pathname } = req.nextUrl;

    if (req.nextUrl.pathname.startsWith('/_next')) {
        return NextResponse.next();
    }
    if (session && pathname === '/') {
        console.log('Attempting redirect to dash');
        return NextResponse.redirect(new URL('/dashboard', req.url));
    } else if (!session && pathname === '/dashboard') {
        console.log('Attempting redirect to login');
        return NextResponse.redirect(new URL('/', req.url));
    } else if (!session && pathname === '/profile') {
        console.log('Attempting redirect to login');
        return NextResponse.redirect(new URL('/', req.url));
    } else if (!session && pathname === '/search') {
        console.log('Attempting redirect to login');
        return NextResponse.redirect(new URL('/', req.url));
    } else if (!session && pathname.startsWith('/song')) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}
