"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getUserById, getUsersByUsername } from '../../api/user/route';
import { getUserSongReviews } from '../../api/review/route';
import { ReviewProps } from '@/components/review/review-types';
import * as Tabs from '@radix-ui/react-tabs';
import './styles.css';
import { MediaCoverProps } from '@/components/review/AlbumCoverArt';
import { getUserTopSongs } from '../../api/topSongs/route';
import ProfileReviewList from '@/components/review/ProfileReviewList';

interface UserData {
  bio: string | null;
  created_at: string | null,
  id: string, 
  profile_pic: string | null,
  username: string,
  email: string, 
}

export default function UserProfile() {
  const { user_id } = useParams();  // get user_id from url 
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userReviews, setUserReviews] = useState<ReviewProps[] | null>([]);

  useEffect(() => {
    // if user_id is null, return
    if (user_id == null) return;
    // ensure user_id is a string
    if (typeof user_id !== 'string') return;
    // get user data by user id
    getUserById(user_id).then((data) => {
        if (data != null) setUserData(data);
    });
    // get user song reviews
    getUserSongReviews(user_id, 20).then((data) => {
        setUserReviews(data);
    });
  }, [user_id]);    // on change of user id

  // if loading, display nothing
  if (!userData || !userReviews) return <p></p>;

    return (
        <div className='grid grid-flow-row auto-rows-max mb-[15%] mx-auto w-full'>
            <div className='mx-[7%]'>
                <div className='flex items-center space-x-4 border-1px'>
                    {/* Profile Picture */}
                    <img 
                        src={userData.profile_pic || '/default-profile-pic.jpg'} 
                        alt={`${userData.username}'s profile`} 
                        className='w-16 h-16 rounded-full object-cover' 
                    />
                    {/* Username and Bio */}
                    <div>
                        <h1 className='font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>{userData.username}</h1>
                        <p>{userData.bio}</p>
                    </div>
                </div>

                <div className="flex mt-[2%]">
                    <div className="flex-1 ">
                        <Tabs.Root className="TabsRoot flex-shrink-0 w-full w-[300px] md:w-[700px]" defaultValue="overview">
                            <Tabs.List className="TabsList">
                                <Tabs.Trigger value="overview" className="TabsTrigger">Overview</Tabs.Trigger> 
                                <Tabs.Trigger value="reviews" className="TabsTrigger">Reviews</Tabs.Trigger> 
                                <Tabs.Trigger value="concerts" className="TabsTrigger">Concerts</Tabs.Trigger> 
                            </Tabs.List>
                            <Tabs.Content value="overview" className="TabsContent w-full">
                                <ProfileReviewList userReviews={userReviews?.slice(0, 10) || []} />
                            </Tabs.Content>
                            <Tabs.Content value="reviews" className="TabsContent w-full">
                            <ProfileReviewList userReviews={userReviews || []} />
                            </Tabs.Content>
                            <Tabs.Content value="concerts" className="TabsContent w-full">
                                
                            </Tabs.Content>
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
