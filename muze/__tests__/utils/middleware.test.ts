import { middleware } from '@/middleware';
import { NextResponse } from 'next/server';
import * as jwt from 'next-auth/jwt';

describe('middleware', () => {
  beforeEach(() => {
    process.env.NEXTAUTH_SECRET = 'test-secret';
  });

  it('redirects authenticated users from the root ("/") to "/dashboard"', async () => {
    jest.spyOn(jwt, 'getToken').mockResolvedValue({ user: { id: 'user123' } });
    const req = {
      nextUrl: {
        pathname: '/',
        searchParams: new URLSearchParams(),
        toString: () => 'http://localhost/',
      },
      url: 'http://localhost/',
      headers: new Headers(),
    } as any;
    const response = await middleware(req);
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/dashboard');
  });

  it('redirects unauthenticated users from "/dashboard" to "/"', async () => {
    jest.spyOn(jwt, 'getToken').mockResolvedValue(null);
    const req = {
      nextUrl: {
        pathname: '/dashboard',
        searchParams: new URLSearchParams(),
        toString: () => 'http://localhost/dashboard',
      },
      url: 'http://localhost/dashboard',
      headers: new Headers(),
    } as any;
    const response = await middleware(req);
    expect(response.status).toBe(307);
    const location = response.headers.get('location');
    expect(location).toContain('/');
  });

  it('allows requests that do not match any redirect conditions', async () => {
    jest.spyOn(jwt, 'getToken').mockResolvedValue(null);
    const req = {
      nextUrl: {
        pathname: '/other',
        searchParams: new URLSearchParams(),
        toString: () => 'http://localhost/other',
      },
      url: 'http://localhost/other',
      headers: new Headers(),
    } as any;
    const response = await middleware(req);
    expect(response).toBeInstanceOf(NextResponse);
  });
});
