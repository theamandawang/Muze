'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserFollowing } from '@/app/api/follow/route';
import { getUserById } from '@/app/api/user/route';
import { useParams } from 'next/navigation';

export default function Following() {
    const { user_id } = useParams();
    const [following, setFollowing] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user_id) return;

        async function getFollowing() {
            try {
                setIsLoading(true);
                const followingData = await getUserFollowing(user_id);

                if (followingData) {
                    const userFollows = await Promise.all(
                        followingData.map((pair: any) => getUserById(pair.following_id)) 
                    );
                    const filtered = userFollows.filter((user) => user !== null);
                    setFollowing(filtered);
                }
            } catch (err) {
                console.error('Error fetching following:', err);
                setError('Failed to fetch following.');
            } finally {
                setIsLoading(false);
            }
        }

        getFollowing();
    }, [user_id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='min-h-screen flex flex-col items-center p-6'>
            <h1 className='text-2xl font-bold mb-4 pl-4 self-start'>
                Following
            </h1>
            <div className='w-full max-w-6xl p-4 rounded-lg shadow-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                {following?.map((follow) => (
                    <Link key={follow.id} href={`/user/${follow.id}`} className="no-underline">
                        <div className='flex flex-col items-center space-y-2 p-3 rounded-lg min-w-[18%] sm:min-w-[22%] md:min-w-[25%] flex-grow-0 cursor-pointer hover:bg-primary hover:bg-opacity-30 transition'>
                            <div className='w-36 aspect-square rounded-full bg-profile-lavender flex items-center justify-center overflow-hidden'>
                                <Image
                                    src={follow.profile_pic || '/default-profile-pic.svg'}
                                    alt={follow.id}
                                    width={80}
                                    height={80}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='text-center'>
                                <p className='font-semibold text-sm'>
                                    {follow?.username}
                                </p>
                                <p className='text-gray-500 text-xs'>Profile</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
