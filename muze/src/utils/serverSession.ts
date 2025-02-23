import { getServerSession } from 'next-auth';
import authOptions, {
    AuthUser,
} from '@/app/api/auth/[...nextauth]/authOptions';

type SpotifyServerSession = {
    user: AuthUser;
    error: string;
};

export async function checkSession(): Promise<SpotifyServerSession> {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (!session) {
        throw new Error('No user logged in');
    }
    return session;
}
