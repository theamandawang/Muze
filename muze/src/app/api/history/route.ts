import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions, { AuthUser } from '../auth/[...nextauth]/authOptions';

type SpotifyServerSession = {
    user: AuthUser;
    error: string;
};

export async function GET() {
    const session: SpotifyServerSession | null | undefined =
        await getServerSession(authOptions);
    console.log(session);

    if (!session || session.user.expires_in <= 0) {
        return NextResponse.json(
            { message: 'User is not logged in' },
            { status: 401 }
        );
    }

    if (!session != undefined) {
        const response = await fetch(
            'https://api.spotify.com/v1/me/player/recently-played',
            {
                headers: {
                    Authorization: `Bearer ${session.user.access_token}`,
                },
            }
        );

        const final = await response.json();
        return NextResponse.json({ message: final }, { status: 200 });
    } else {
        return NextResponse.json(
            { message: 'User is not logged in' },
            { status: 401 }
        );
    }
}
