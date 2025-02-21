import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]/authOptions';
import { createServerClient } from '@/db/SupabaseServer';

// Follow a User
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

    if (userId === following_id) {
        return NextResponse.json({ error: "You cannot follow yourself!" }, { status: 400 });
    }

    const supabase = createServerClient();

    // Prevent duplicate follows
    const { data: existingFollow } = await supabase
        .from('following')
        .select('*')
        .eq('follower_id', userId)
        .eq('following_id', following_id)
        .single();

    if (existingFollow) {
        return NextResponse.json({ error: "You are already following this user!" }, { status: 400 });
    }

    const { error } = await supabase.from('following').insert({
        follower_id: userId,
        following_id
    });

    if (error) {
        return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User followed successfully" }, { status: 200 });
}

// Unfollow a User
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
    const { error } = await supabase.from('following')
        .delete()
        .match({ follower_id: userId, following_id });

    if (error) {
        return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
    }

    return NextResponse.json({ message: "User unfollowed successfully" }, { status: 200 });
}

// Get a User's Following or Followers (Public)
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");
    const type = searchParams.get("type"); // "following" or "followers"

    if (!userId) {
        return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    if (!type || (type !== "following" && type !== "followers")) {
        return NextResponse.json({ error: "Invalid or missing type parameter (must be 'following' or 'followers')" }, { status: 400 });
    }

    const supabase = createServerClient();

    let query;
    if (type === "following") {
        query = supabase.from('following').select('following_id').eq('follower_id', userId);
    } else {
        query = supabase.from('following').select('follower_id').eq('following_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: `Failed to fetch ${type} list` }, { status: 500 });
    }

    return NextResponse.json({ [type]: data }, { status: 200 });
}
