import { CreateUser, UpdateUser, UploadPhoto } from '@/db/UserUpdate';
import { supabase } from '@/lib/supabase/supabase';
import { checkSession } from '@/utils/serverSession';

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

jest.mock('@/utils/serverSession', () => ({
    __esModule: false,
    checkSession: jest.fn(),
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
                match: mockMatch.mockReturnValue(() => {
                    Promise.resolve(null);
                }),
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
        // ideally would also expect match to contain id, id but can't figure it out.
    });
});

// describe('UploadPhoto', () => {
//     beforeEach(() => {
//         jest.clearAllMocks();
//     });
//     const file = mockFile('png', 1024);

//     const user = {
//         id: 'user123',
//         email: 'test@example.com',
//         name: 'Test User',
//         picture: 'https://test.com/profile.jpg',
//     };
//     it('uploads file', async () => {
//         const filePath = `${user.id}/avatar.png`;

//         (supabase.storage.from as jest.Mock).mockReturnValue({
//             update: jest.fn().mockResolvedValue({
//                 data: {
//                     id: 'id',
//                     path: filePath,
//                     fullPath: 'fullPath',
//                 },
//                 error: null,
//             }),
//         });

//         expect(checkSession).toHaveBeenCalled();
//         expect(supabase.storage.from('avatars').update).toHaveBeenCalledWith(
//             filePath,
//             file,
//             expect.objectContaining({})
//         );
//     });

//     it('does not upload if user session errors', async () => {
//         (checkSession as jest.Mock).mockResolvedValue(
//             Promise.resolve({
//                 user,
//                 error: 'Failed',
//             })
//         );
//         expect(async () => {
//             await UploadPhoto(file);
//         }).rejects.toThrow();
//     });
// });
