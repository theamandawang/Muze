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
import { SpotifyApi } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';

const AlbumSelection = ({ setTopAlbums }: { setTopAlbums: (album: Track | Album) => void }) => {
    const [selectedAlbums, setSelectedAlbums] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Album[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const { data: session } = useSession();
    const userId = (session?.user as AuthUser)?.id;

    const handleSelectAlbum = (album_img : string, album_id: string) => {
        if (activeIndex !== null) {
            const newSelection = [...selectedAlbums];
            // TODO: fix typing here
            newSelection[activeIndex] = album_img;
            setSelectedAlbums(newSelection);
            updateUserTopSongs(userId, album_id, activeIndex + 1);
            setActiveIndex(null); // Close modal
        }
    };

    useEffect(() => {
        const fetchTopAlbums = async () => {
            

            // TODO: actually setSelectedAlbums based on getUserTopSongs()
            try {
                const topAlbums = await getUserTopSongs(userId);
                if (topAlbums == null) return;
                const covers = await Promise.all(
                    topAlbums.map(async (album) => {
                        return (sdk.albums.get(album.song_id)).then((album) => {return album.images[0].url})
                    })
                );
                setSelectedAlbums(covers);
            } catch (err) {
                console.error("Failed to load top albums");
                console.error(err);
            }
        };

        fetchTopAlbums();
    }, []);

    return (
    <div>
    <h3 className="font-bold">Select your Top 4 Albums!</h3>
    <div className="grid grid-cols-4 gap-4 w-full max-w-lg mx-auto">
        {selectedAlbums.map((album_img, index) => (
        <Dialog key={index} onOpenChange={(open) => !open && setActiveIndex(null)}>
            <DialogTrigger asChild>
            <Card
                className="flex items-center justify-center w-32 h-32 border border-gray-400 rounded-lg cursor-pointer hover:border-gray-600"
                onClick={() => setActiveIndex(index)}
            >
                {album_img ? (
                <img src={album_img} alt={album_img} className="w-full h-full object-cover rounded-lg" />
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
