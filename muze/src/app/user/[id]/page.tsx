"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById } from '../../api/user/route';
import { SearchResults, SpotifyApi, Track } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { getUserSongReviews } from '../../api/review/route';
import { follow, unfollow, getCurrentUserFollowing, getUserFollowingCount, getUserFollowerCount } from '../../api/follow/route';
import { ReviewProps } from '@/components/review/review-types';
import FollowButton from '@/components/buttons/FollowButton';
import * as Tabs from '@radix-ui/react-tabs';
import './styles.css';
import { getUserTopSongs } from '../../api/topSongs/route';
import ProfileReviewList from '@/components/review/ProfileReviewList';
import EditProfileModal from '@/components/edit_profile/editProfileModal';
import { Button } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import checkClientSessionExpiry from '@/utils/checkClientSessionExpiry';
import Events from '@/components/events/EventsList';
import TopAlbums from '@/components/profile/TopAlbums';

interface UserData {
  bio: string | null;
  created_at: string | null,
  id: string, 
  profile_pic: string | null,
  username: string,
  email: string, 
}

export default function UserProfile() {
  const router = useRouter();
  const { id } = useParams();  // get user_id from url 
  const { data: session, status } = useSession();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<ReviewProps[] | null>([]);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [topAlbums, setTopAlbums] = useState<{id: string, name: string, coverArt: string}[]>([]);
  const [following, setFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!checkClientSessionExpiry(session, status)) {
    router.push('/');
  }

  useEffect(() => {
    // if user id is null, return
    if (!id) return;
    // ensure user id is a string
    if (typeof id !== 'string') return;
    // get user data by user id
    getUserById(id).then((data) => {
        if (data != null) setUserData(data);
    });
    // get user song reviews
    getUserSongReviews(id, 20).then((data) => {
        setUserReviews(data);
    });
    // get user following count
    getUserFollowingCount(id).then((count) => {
        setFollowingCount(count);
    });
    // get user follower count
    getUserFollowerCount(id).then((count) => {
        setFollowerCount(count);
    });
    // get current user following data
    getCurrentUserFollowing().then((followingData) => {
        if (followingData?.some(follow => follow.following_id == id)){
            setFollowing(true);
        }
    });

    const fetchTopAlbums = async () => {
                
    
        try {
            const topAlbums = await getUserTopSongs(id);
            if (topAlbums == null) return;
            const covers = await Promise.all(
                topAlbums.map(async (album) => {
                    return (sdk.albums.get(album.song_id)).then((album) => {return {id: album.id, name: album.name, coverArt: album.images[0].url}})
                })
            );
            setTopAlbums(covers);
        } catch (err) {
            console.error("Failed to load top songs");
            console.error(err);
        }
    };
    
    fetchTopAlbums();
    
  }, [id]);    // on change of user id

  const onProfileUpdate = () => {
    if (id) {
        if (typeof id !== 'string') return;
        getUserById(id).then((data) => {
        if (data) setUserData(data); // Update userData with the new profile info
      });
    }
  };
  
  const toggleFollow = async () => {
    if (!id) return;
    if (typeof id !== 'string') return;

    setIsLoading(true);

    try {
        setFollowing((prev) => !prev);
        setFollowerCount((prev) => (following ? prev - 1 : prev + 1));

        if (following) {
            await unfollow(id);
        } else {
            await follow(id);
        }
    } catch (error) {
        console.error("Error toggling follow:", error);
        setFollowing((prev) => !prev);
        setFollowerCount((prev) => (following ? prev + 1 : prev - 1));
    } finally {
        setIsLoading(false);
    }
};

  // if loading, display nothing
  if (!userData || !userReviews) return <p></p>;

    return (
        <div className='grid grid-flow-row auto-rows-max mb-[15%] mx-auto w-full'>
            <div className='mx-[7%]'>
                <div className='flex items-center space-x-4 border-1px'>
                    {/* Profile Picture */}
                    <Image
                        src={userData.profile_pic || '/default-profile-pic.jpg'} 
                        alt={`${userData.username}'s profile`} 
                        className='w-16 h-16 rounded-full object-cover' 
                        width={100}
                        height={100}
                    />
                    {/* Username, Bio, and Followers/Following Count */}
                    <div>
                        <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>{userData.username}</h1>
                        <p>{userData.bio}</p>
                        <p className='text-gray-500 text-sm'>
                            <Link href={`/user/${id}/followers`} className='hover:underline'>
                            {followerCount} followers
                            </Link>{' '}•{' '}
                            <Link href={`/user/${id}/following`} className='hover:underline'>
                            {followingCount} following
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Edit Profile Button */}
                {session.user.id === id && ( // Button only appears on current user's profile
                <div>
                        <Button 
                        onClick={() => setIsEditModalOpen(true)}
                        sx={{
                            marginTop: 2,
                            backgroundColor:'transparent', 
                            color: 'var(--primary)', 
                            border: `1px solid var(--primary)`,
                            '&:hover': {
                                backgroundColor: 'var(--primary)', 
                                color: 'white',
                            }
                        }}
                        >
                        Edit Profile
                        </Button>

                        <Button 
                        onClick={() => router.push(`/profile/select-top-albums`)}
                        sx={{
                            marginTop: 2,
                            backgroundColor:'transparent', 
                            color: 'var(--primary)', 
                            border: `1px solid var(--primary)`,
                            '&:hover': {
                                backgroundColor: 'var(--primary)', 
                                color: 'white',
                            }
                        }}
                        >
                        Edit Top Songs
                        </Button>
                    </div>
                )}

                {/* Edit Profile Modal */}
                <EditProfileModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onProfileUpdate={onProfileUpdate} />

                {/* Follow/Unfollow Button */}
                {session.user.id !== id && ( // Button only appears for profiles that are not the current user's profile
                <div className='mt-4'>
                    <FollowButton
                        following={following}
                        isLoading={isLoading}
                        toggleFollow={toggleFollow}
                    />
                </div>
                )}

                <div className="flex mt-[2%]">
                    <div className="flex-1 ">
                        <Tabs.Root className="TabsRoot flex-shrink-0 w-full w-[300px] md:w-[700px]" defaultValue="overview">
                            <Tabs.List className="TabsList">
                                <Tabs.Trigger value="overview" className="TabsTrigger">Overview</Tabs.Trigger> 
                                <Tabs.Trigger value="topAlbums" className="TabsTrigger">Top Albums</Tabs.Trigger> 
                                {session.user.id === id && 
                                    <Tabs.Trigger value="events" className="TabsTrigger">Events</Tabs.Trigger> 
                                }
                            </Tabs.List>
                            <Tabs.Content value="overview" className="TabsContent w-full">
                                <ProfileReviewList userReviews={userReviews?.slice(0, 10) || []} />
                            </Tabs.Content>
                            <Tabs.Content value="topAlbums" className="TabsContent w-full">
                                <TopAlbums topAlbums={topAlbums}/>
                            </Tabs.Content>
                            {session.user.id === id && 
                                <Tabs.Content value="events" className="TabsContent w-full">
                                    <Events />
                                </Tabs.Content>
                            }
                        </Tabs.Root>
                    </div>

                    {/* Placeholder for TopAlbums component */}
                    {/* <div className="sticky top-[50px] max-w-sm w-full mx-12 p-3 h-full rounded-lg">
                        <h3 className='font-bold text-xl mt-[2%]'>{userData.username}'s top 4</h3>
                        <TopAlbums/>
                    </div> */}
                </div>

            </div>
        </div>
    );
}
