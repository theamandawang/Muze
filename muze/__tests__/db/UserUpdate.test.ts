import { CreateUser, UploadPhoto } from '@/db/UserUpdate';
import SupabaseClient from '@/db/SupabaseClient';
import { checkSession } from '@/utils/serverSession';

jest.mock('@/db/SupabaseClient', () => ({
    __esModule: true,
    default: {
        storage: {
            from: jest.fn(() => ({
                update: jest.fn(),
            })),
        },
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(),
            })),
            upsert: jest.fn(() => ({
                select: jest.fn(),
            })),
            update: jest.fn(() => ({
                match: jest.fn(() => ({
                    select: jest.fn(),
                })),
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
    const user = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://test.com/profile.jpg',
    };
    it('upserts if a user session is detected', async () => {
        (checkSession as jest.Mock).mockResolvedValue(
            Promise.resolve({
                user,
                error: null,
            })
        );
        (SupabaseClient.from as jest.Mock).mockReturnValue({
            upsert: jest.fn().mockReturnValue({
                select: jest.fn().mockResolvedValue({
                    data: [user],
                    error: null,
                }),
            }),
        });

        await CreateUser();

        expect(checkSession).toHaveBeenCalled();
        expect(SupabaseClient.from('users').upsert).toHaveBeenCalledWith(
            expect.objectContaining({ id: user.id, email: user.email }),
            expect.objectContaining({})
        );
    });

    it('does not upsert if user session errors', async () => {
        (checkSession as jest.Mock).mockResolvedValue(
            Promise.resolve({
                user,
                error: 'Failed',
            })
        );
        expect(async () => {
            await CreateUser();
        }).rejects.toThrow();
    });

    it('does not upsert if user is null', async () => {
        (checkSession as jest.Mock).mockResolvedValue(
            Promise.resolve({
                user: null,
                error: 'Failed',
            })
        );
        expect(async () => {
            await CreateUser();
        }).rejects.toThrow();
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

describe('UploadPhoto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const file = mockFile('jpg', 1024);

    const user = {
        id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        picture: 'https://test.com/profile.jpg',
    };
    it('uploads if a user session is detected', async () => {
        (checkSession as jest.Mock).mockResolvedValue(
            Promise.resolve({
                user,
                error: null,
            })
        );

        const filePath = `${user.id}/avatar.jpg`;

        (SupabaseClient.storage.from as jest.Mock).mockReturnValue({
            update: jest.fn().mockResolvedValue({
                data: {
                    id: 'id',
                    path: filePath,
                    fullPath: 'fullPath',
                },
                error: null,
            }),
        });

        await UploadPhoto(file);

        expect(checkSession).toHaveBeenCalled();
        expect(
            SupabaseClient.storage.from('avatars').update
        ).toHaveBeenCalledWith(filePath, file, expect.objectContaining({}));
    });

    it('does not upload if user session errors', async () => {
        (checkSession as jest.Mock).mockResolvedValue(
            Promise.resolve({
                user,
                error: 'Failed',
            })
        );
        expect(async () => {
            await UploadPhoto(file);
        }).rejects.toThrow();
    });
});
