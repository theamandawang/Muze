import { CreateUser, UpdateUser, UploadPhoto } from '@/db/UserUpdate';
import { supabase } from '@/lib/supabase/supabase';

jest.mock('@/lib/supabase/supabase', () => ({
    __esModule: true,
    supabase: {
        storage: {
            from: jest.fn(() => ({
                update: jest.fn(),
                remove: jest.fn(),
            })),
        },
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(),
            })),
            upsert: jest.fn(),
            update: jest.fn(() => ({
                match: jest.fn(),
            })),
        })),
    },
}));

describe('CreateUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const mockToken = {
        access_token: 'valid_token',
        token_type: 'Bearer',
        expires_at: Math.floor(Date.now() / 1000) + 3600, // Valid for 1 hour
        expires_in: 3600,
        refresh_token: 'refresh_token',
        scope: 'user-read-email',
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://test.com/profile.png',
    };
    it('upserts if a token is given', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
            upsert: jest.fn().mockResolvedValue(() => {
                Promise.resolve({
                    error: null,
                });
            }),
        });

        await CreateUser(mockToken);

        expect(supabase.from('users').upsert).toHaveBeenCalledWith(
            expect.objectContaining({
                id: mockToken.id,
                email: mockToken.email,
                username: mockToken.name,
                profile_pic: mockToken.picture,
            }),
            expect.objectContaining({})
        );
    });
    it('throws error if upsert fails', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
            upsert: jest
                .fn()
                .mockResolvedValue({ error: { message: 'error' } }),
        });

        try {
            await CreateUser(mockToken);

            expect(supabase.from('users').upsert).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: mockToken.id,
                    email: mockToken.email,
                    username: mockToken.name,
                    profile_pic: mockToken.picture,
                }),
                expect.objectContaining({})
            );
        } catch (error) {
            expect(error).toEqual(Error('Upsert failed! ' + 'error'));
        }
    });
});

const mockFile = (type: string, size: number): File => {
    const fileName =
        (Math.random() * 1000).toString().replace('.', '') +
        '.' +
        type.toLowerCase();
    const file = new File([''], fileName);
    Object.defineProperty(file, 'size', { value: size });
    return file;
};

describe('UpdateUser', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // our inputs
    const userInfo = {
        id: 'user123',
        username: 'Test User',
        bio: 'my bio',
        profile_pic: 'https://test.com/profile.png',
    };

    const mockUpdate = jest.fn();
    const mockMatch = jest.fn();

    it('updates user', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
            update: mockUpdate.mockReturnValue({
                match: mockMatch.mockResolvedValue({ error: null }),
            }),
        });

        await UpdateUser(
            userInfo.id,
            userInfo.username,
            userInfo.bio,
            userInfo.profile_pic
        );

        expect(mockUpdate).toHaveBeenCalledWith(
            expect.objectContaining({
                username: userInfo.username,
                bio: userInfo.bio,
                profile_pic: userInfo.profile_pic,
            })
        );

        expect(mockMatch).toHaveBeenCalledWith(
            expect.objectContaining({
                id: userInfo.id,
            })
        );
    });

    it('throw error if update fails', async () => {
        (supabase.from as jest.Mock).mockReturnValue({
            update: mockUpdate.mockReturnValue({
                match: mockMatch.mockResolvedValue({ error: 'Error' }),
            }),
        });

        try {
            await UpdateUser(
                userInfo.id,
                userInfo.username,
                userInfo.bio,
                userInfo.profile_pic
            );
            expect(mockUpdate).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: userInfo.username,
                    bio: userInfo.bio,
                    profile_pic: userInfo.profile_pic,
                })
            );

            expect(mockMatch).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: userInfo.id,
                })
            );
        } catch (error) {
            expect(error.message).toBe(
                'Error updating user info for ' + userInfo.id
            );
        }
    });
});

describe('UploadPhoto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const file = mockFile('png', 1024);
    const userId = 'user123';
    const filePath = `${userId}/avatar.png`;
    it('uploads file', async () => {
        (supabase.storage.from as jest.Mock).mockReturnValue({
            update: jest.fn().mockResolvedValue({
                data: {
                    id: 'id',
                    path: filePath,
                    fullPath: `avatars/${filePath}`,
                },
                error: null,
            }),
        });

        const url = await UploadPhoto(userId, file);

        expect(supabase.storage.from('avatars').update).toHaveBeenCalledWith(
            filePath,
            file,
            expect.objectContaining({})
        );

        expect(url).toBe(
            process.env.NEXT_PUBLIC_SUPABASE_URL +
                `/storage/v1/object/public/avatars/${filePath}`
        );
    });

    it('throw error if upload fails', async () => {
        (supabase.storage.from as jest.Mock).mockReturnValue({
            update: jest.fn().mockResolvedValue({
                data: null,
                error: 'Error',
            }),
        });
        try {
            await UploadPhoto(userId, file);
        } catch (error) {
            expect(error).toBe('Error');
        }
    });
});
