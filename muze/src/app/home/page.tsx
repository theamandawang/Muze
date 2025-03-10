 'use client';

import Hero from "@/components/hero/Hero"
import Review from "@/components/review/DiscoverReviewNarrow"
import ReviewWide from "@/components/review/DiscoverReviewWide"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { getLatestSongReviews, getMultipleUserSongReviews } from "../api/review/route";
import { getUserTopSongs } from "../api/topSongs/route";
import { useSession } from "next-auth/react";
import checkClientSessionExpiry from "@/utils/checkClientSessionExpiry";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../api/user/route";
import { getCurrentUserFollowing } from "../api/follow/route";
import Link from "next/link";
import { MousePointerClickIcon } from "lucide-react";

import { SpotifyApi } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';

export default function HomePage() {
    const [latestSongReviews, setLatestSongReviews] = useState<any[]>([]);
    const [albumCovers, setAlbumCovers] = useState<string[]>([]);

    const {data: session, status} = useSession();
    if (!checkClientSessionExpiry(session, status)) {
            redirect(`/`);
    }
    const [displayName, setDisplayName] = useState<string>('');
    const [latestFollowingReviews, setLatestFollowingReviews] = useState<any[]>([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Fetch the 10 newest reviews
                const currUser = await getCurrentUser(); 
                const currUserFollowing = await getCurrentUserFollowing();

                if(currUser && currUserFollowing) {
                    const followingRevs = await getMultipleUserSongReviews(currUserFollowing.map((user) => {return user.following_id}))
                    setDisplayName(currUser.username);
                    setLatestFollowingReviews(followingRevs);
                } else {
                    // display nothing; our api calls errored.
                    console.error('Failed to get user or user following.')
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
        const fetchReviews = async () => {
            try {
                // Fetch the 10 newest reviews
                const reviews = await getLatestSongReviews(10); 
                setLatestSongReviews(reviews);

            // Extract album cover images from lastest reviews (temporary for visualization purposes)
            // Comment out once users can set their favorite songs
                const covers = reviews
                    .map((review) => review.mediaCoverArt) // Get the cover images
                    .filter((cover) => cover); // Remove undefined/null covers

                setAlbumCovers(covers.slice(0, 5)); // Limit to 5 covers for the hero section

            } catch (err) {
                console.error("Failed to load reviews")
            } finally {
                // console.log("Done loading reviews!")
            }
        };

        fetchReviews();

        const fetchAlbumCovers = async () => {
            try {
                // misleading title of top songs... but we actually mean top albums.
                const userTopAlbums = (await getUserTopSongs(session.user.id)) || [];

            
                console.log(userTopAlbums);
                const covers = await Promise.all(
                    userTopAlbums.map(async (album) => {
                        return (sdk.albums.get(album.song_id)).then((album) => {return album.images[0].url})
                    })
                );
                setAlbumCovers(covers.slice(0, 4));
            } catch (err) {
                console.error("Failed to load top songs");
                console.error(err);
            }
        };

        fetchAlbumCovers();
    }, [session]); 

    return (
    <div className="w-full">
        <Hero displayName={displayName} albumArts={albumCovers}></Hero>        
        <div className="mx-auto w-[85%] p-4 space-y-8">
            {/* Popular with Friends Section */}
            <section className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Popular with Friends</h2>
            <ScrollArea className="max-w-screen-xl overflow-x-auto w-full">
                <div className="flex gap-0 pb-4 w-full"> 
                {latestFollowingReviews.map((review, index) => (
                    <div key={index} className="flex-shrink-0 w-[150px] md:w-[200px] m-2"> 
                    <Review {...review} />
                    </div>
                ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            </section>
            {/* Music Battles Section */}
            <section className="w-full">
                <div className="bg-primary flex hover:bg-primary-dark transition-colors duration-300 cursor-pointer hover:shadow-lg">
                    <Link
                        className="text-2xl font-bold place-content-center m-8 flex items-center gap-2 hover:opacity-80 transition-opacity duration-300"
                        href="/music_battle"
                    >
                        <h2>Vote for your favorite artists here! 😝🤘</h2>
                        <MousePointerClickIcon className="w-6 h-6" />
                    </Link>
                </div>
            </section>
            {/* Your Feed or Other Sections */}
            <section className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Latest on Muze</h2>
            <div className="grid xs:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-auto justify-items-center justify-between">
                {latestSongReviews.map((review, index) => (
                        <div key={index} className="flex-shrink-0"> 
                        <ReviewWide {...review} />
                        </div>
                ))}
            </div>
            </section>
        </div>
    </div>
    )
}