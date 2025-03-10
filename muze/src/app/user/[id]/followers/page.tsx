'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getUserFollowers } from '@/app/api/follow/route';
import { getMultipleUsersById } from '@/app/api/user/route';
import { useParams } from 'next/navigation';

export default function Followers() {
    const { id } = useParams();
    const [followers, setFollowers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        async function getFollowers() {
            try {
                setIsLoading(true);
                if (typeof id !== 'string') return;
                const followersData = await getUserFollowers(id);

                if (followersData) {
                    const followerIds = followersData.map((pair: any) => pair.follower_id);
                    const userFollowers = await getMultipleUsersById(followerIds);
                    if (userFollowers) setFollowers(userFollowers);
                }
            } catch (err) {
                console.error('Error fetching followers:', err);
                setError('Failed to fetch followers.');
            } finally {
                setIsLoading(false);
            }
        }

        getFollowers();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='min-h-screen flex flex-col items-center p-6'>
            <h1 className='text-2xl font-bold mb-4 pl-4 self-start'>
                Followers
            </h1>
            <div className='w-full max-w-6xl p-4 rounded-lg shadow-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                {followers?.map((follower) => (
                    <Link key={follower.id} href={`/user/${follower.id}`} className="no-underline">
                        <div className='flex flex-col items-center space-y-2 p-3 rounded-lg min-w-[18%] sm:min-w-[22%] md:min-w-[25%] flex-grow-0 cursor-pointer hover:bg-primary hover:bg-opacity-30 transition'>
                            <div className='w-36 aspect-square rounded-full bg-profile-lavender flex items-center justify-center overflow-hidden'>
                                <Image
                                    src={follower.profile_pic || '/default-profile-pic.svg'}
                                    alt={follower.id}
                                    width={80}
                                    height={80}
                                    className='w-full h-full object-cover'
                                />
                            </div>
                            <div className='text-center'>
                                <p className='font-semibold text-sm'>
                                    {follower?.username}
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
