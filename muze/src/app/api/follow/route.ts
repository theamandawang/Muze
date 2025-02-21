import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/authOptions';
import { createServerClient } from '@/db/SupabaseServer';

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { following_id } = await req.json();

    if (!following_id) {
        return NextResponse.json({ error: "Missing following_id" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('user_following').insert({
        follower_id: userId,
        following_id
    });

    if (error) {
        return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User followed successfully" }, { status: 200 });
}

export async function DELETE(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const { following_id } = await req.json();

    if (!following_id) {
        return NextResponse.json({ error: "Missing following_id" }, { status: 400 });
    }

    const supabase = createServerClient();
    const { error } = await supabase.from('user_following')
        .delete()
        .match({ follower_id: userId, following_id });

    if (error) {
        return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User unfollowed successfully" }, { status: 200 });
}
