import { getServerSession } from 'next-auth';
import authOptions, {
    AuthUser,
} from '@/app/api/auth/[...nextauth]/authOptions';

type SpotifyServerSession = {
    user: AuthUser;
    error: string;
};

export async function checkSession() {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);

    if (
        !session ||
        !session.user ||
        session.error ||
        session.user.expires_at <= Date.now()/1000
    ) {
        throw new Error('No user logged in');
    }
    return session;
}
