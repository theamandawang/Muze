import Link from 'next/link';
import Image from 'next/image';
import { getCurrentUserFollowing } from '@/app/api/follow/route';
import { getUserById } from '@/app/api/user/route';

export default async function Follows() {
    async function getFollowing() {
        const following = await getCurrentUserFollowing();
        if (following) {
            const userFollowing = await Promise.all(
                following?.map((pair) => {
                    return getUserById(pair.following_id);
                })
            );
            const filtered = userFollowing.filter((user) => user !== null);
            return filtered;
        }
        return null;
    }
    const isFollowing = true;
    const followers = await getFollowing();

    return (
        <div className='min-h-screen flex flex-col items-center p-6'>
            <h1 className='text-2xl font-bold mb-4 pl-4 self-start'>
                {isFollowing ? 'Following' : 'Followers'}
            </h1>
            <div className='w-full max-w-6xl p-4 rounded-lg shadow-md grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6'>
                {followers?.map((follower) => (
                    <Link key={follower.id} href={`/users/${follower.id}`} className="no-underline">
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
