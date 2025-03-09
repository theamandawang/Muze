 'use client';

import Hero from "@/components/hero/Hero"
import Review from "@/components/review/DiscoverReviewNarrow"
import ReviewWide from "@/components/review/DiscoverReviewWide"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { getLatestSongReviews } from "../api/review/route";
import { getUserTopSongs } from "../api/topSongs/route";
import { useSession } from "next-auth/react";
import checkClientSessionExpiry from "@/utils/checkClientSessionExpiry";
import { redirect } from "next/navigation";

export default function HomePage() {
    const [latestSongReviews, setLatestSongReviews] = useState<any[]>([]);
    const [albumCovers, setAlbumCovers] = useState<string[]>([]);

    const {data: session, status} = useSession();
    if (!checkClientSessionExpiry(session, status)) {
            redirect(`/`);
    }

    useEffect(() => {
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
    }, []); 
   
   


    {/* Code for fetching album covers of top songs*/}
    // useEffect(() => {
    //     if (!session) return;

    //     const fetchAlbumCovers = async () => {
    //         try {
    //             const userTopSongs = await getUserTopSongs(session.user.id) || [];
        
    //             const covers = userTopSongs
    //                 .map((song) => song.songs?.img)
    //                 .filter((cover): cover is string => Boolean(cover));

    //             setAlbumCovers(covers.slice(0, 5));
    //         } catch (err) {
    //             console.error("Failed to load top songs");
    //         }
    //     };

    //     fetchAlbumCovers();
    // }, [session]);

    return (
    <div className="w-full">
        <Hero displayName="maxine"></Hero>        
        <div className="mx-auto w-[85%] p-4 space-y-8">
            {/* Popular with Friends Section */}
            <section className="w-full">
            <h2 className="text-2xl font-bold mb-4 text-center">Popular with Friends</h2>
            <ScrollArea className="max-w-screen-xl overflow-x-auto w-full">
                <div className="flex gap-0 pb-4 w-full"> 
                {latestSongReviews.map((review, index) => (
                    <div key={index} className="flex-shrink-0 w-[150px] md:w-[200px] m-2"> 
                    <Review {...review} />
                    </div>
                ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
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