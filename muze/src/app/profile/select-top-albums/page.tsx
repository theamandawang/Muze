"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import SearchBar from "@/components/profile/SpotifySearch";
import { Track, Album } from '@spotify/web-api-ts-sdk';
import { useSession } from "next-auth/react";
import { AuthUser } from "@/app/api/auth/[...nextauth]/authOptions";
import { getUserTopSongs, updateUserTopSongs } from "@/app/api/topSongs/route";
import getSpotifyAlbumInfo from "@/spotify-api/getAlbumInfo";

const AlbumSelection = ({ setTopAlbums }: { setTopAlbums: (album: Track | Album) => void }) => {
    const [selectedAlbums, setSelectedAlbums] = useState<(Album | null)[]>([null, null, null, null]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Album[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { data: session } = useSession();
    const userId = (session?.user as AuthUser)?.id;

    const handleSelectAlbum = (album: Track | Album) => {
        if (activeIndex !== null) {
            const newSelection = [...selectedAlbums];
            // TODO: fix typing here
            newSelection[activeIndex] = album;
            setSelectedAlbums(newSelection);
            updateUserTopSongs(userId, album.id, activeIndex + 1);
            setActiveIndex(null); // Close modal
        }
    };

    useEffect(() => {
        const fetchTopAlbums = async () => {
            const topAlbums = await getUserTopSongs(userId);
            if (topAlbums == null) return;

            // TODO: actually setSelectedAlbums based on getUserTopSongs()

            // const albumsWithDetails = await Promise.all(
            //     topAlbums.map(async (albumData) => {
            //         if (!albumData.songs || !albumData.songs.spotify_id) return albumData;
            //         const spotifyId = albumData.songs.spotify_id;
            //         try {
            //             const albumDetails =  getSpotifyAlbumInfo(albumData.songs.spotify_id);
            //             return {
            //                 ...albumData,
            //                 albumDetails, // This contains the detailed album info from Spotify API
            //             };
            //         } catch (error) {
            //             console.error('Error fetching album details for Spotify ID:', spotifyId, error);
            //             return albumData; // Return the original data if there's an error
            //         }
            //     })
            // );
        
            // return albumsWithDetails;
        };

        fetchTopAlbums();
    }, []);

    return (
    <div>
    <h3 className="font-bold">Select your Top 4 Albums!</h3>
    <div className="grid grid-cols-4 gap-4 w-full max-w-lg mx-auto">
        {selectedAlbums.map((album, index) => (
        <Dialog key={index} onOpenChange={(open) => !open && setActiveIndex(null)}>
            <DialogTrigger asChild>
            <Card
                className="flex items-center justify-center w-32 h-32 border border-gray-400 rounded-lg cursor-pointer hover:border-gray-600"
                onClick={() => setActiveIndex(index)}
            >
                {album ? (
                <img src={album.images?.[0].url || ""} alt={album.name} className="w-full h-full object-cover rounded-lg" />
                ) : ( 
                <span className="text-3xl text-gray-500">+</span>
                )} 
            </Card>
            </DialogTrigger>
            <DialogContent className="p-4"> 
                <div className="mt-4 space-y-2 max-h-[600px] overflow-y-auto">
                    <SearchBar onMediaSelect={handleSelectAlbum}/>
                </div> 
            </DialogContent>
        </Dialog>
        ))}
    </div>
    </div>
    );
};

export default AlbumSelection;
