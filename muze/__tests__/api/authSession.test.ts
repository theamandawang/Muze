import authOptions from '@/app/api/auth/[...nextauth]/authOptions';
import { JWT } from 'next-auth/jwt';
import { createUser } from '@/app/api/user/route';

jest.mock('@/app/api/user/route', () => ({
    __esModule: false,
    createUser: jest.fn(),
}));

describe('Auth Session Management', () => {
    (createUser as jest.Mock).mockResolvedValue(true);
    it('returns an updated token when an access token is available', async () => {
        const mockToken: JWT = {
            access_token: 'old_token',
            token_type: 'Bearer',
            expires_at: Math.floor(Date.now() / 1000) - 100, // Expired token
            expires_in: -100,
            refresh_token: 'refresh_token',
            scope: 'user-read-email',
            id: 'user123',
        };

        if (!authOptions.callbacks || !authOptions.callbacks.jwt) {
            throw new Error(
                'authOptions.callbacks or authOptions.callbacks.jwt is undefined'
            );
        }

        const refreshedToken = await authOptions.callbacks.jwt({
            token: mockToken,
            account: {
                access_token: 'new_token',
                expires_at: Math.floor(Date.now() / 1000) + 3600,
                providerAccountId: '',
                provider: '',
                type: 'email',
            },
            user: {
                id: 'user123',
                name: 'Test User',
                email: 'test@muze.com',
                emailVerified: null,
            },
        });

        expect(refreshedToken).toHaveProperty('access_token');
        expect(refreshedToken.access_token).not.toBe(mockToken.access_token);
    });

    it('creates a valid session object with user details', async () => {
        const mockSession = {
            user: {
                name: 'Test User',
                email: 'test@muze.com',
                image: 'https://example.com/avatar.jpg',
            },
            expires: '9999-12-31T23:59:59.999Z',
        };

        const mockToken = {
            access_token: 'valid_token',
            token_type: 'Bearer',
            expires_at: Math.floor(Date.now() / 1000) + 3600, // Valid for 1 hour
            expires_in: 3600,
            refresh_token: 'refresh_token',
            scope: 'user-read-email',
            id: 'user123',
        };

        if (!authOptions.callbacks || !authOptions.callbacks.session) {
            throw new Error(
                'authOptions.callbacks or authOptions.callbacks.session is undefined'
            );
        }

        const session = await authOptions.callbacks.session({
            session: mockSession,
            token: mockToken,
            user: {
                id: 'user123',
                name: 'Test User',
                email: 'test@muze.com',
                emailVerified: null,
            },
            newSession: true,
            trigger: 'update',
        });

        if (!session.user) {
            throw new Error('session.user is undefined');
        }
        expect(session.user.name).toBe('Test User');
        expect(session.user.email).toBe('test@muze.com');
        expect(session.expires).toBe(mockSession.expires);
    });
});
