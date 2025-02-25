'use client';

import { SearchResults, SpotifyApi, Track } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession } from 'next-auth/react';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from 'react';

export default function Search() {
    const session = useSession();
    if (!session || session.status !== 'authenticated') {
        // TODO: redirect to the log in screen.
        return <div></div>;
    }

    return (
        <div>
            <SpotifySearch sdk={sdk} />
        </div>
    );
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi }) {
    const [results, setResults] = useState<SearchResults>({} as SearchResults);
    const [selectedTrack, setSelectedTrack] = useState<Track>({} as Track);
    const albumArt = selectedTrack?.album?.images[0].url;
    const artists = selectedTrack?.artists ? selectedTrack?.artists[0]?.name : null;
    const name = selectedTrack?.name;

    const refresh = useDebouncedCallback(
        async (value) => {
            if (value === '') {
                setResults({});
            } else {
                const results = await sdk.search(value, [
                    'artist',
                    'track',
                    'album',
                ]);
                setResults(() => results);
            }
        },
        // delay in ms
        200
    );

    const handleClickTrack = (track: any) => {
        setSelectedTrack(track);
    }

    useEffect(() => {
        if (selectedTrack){
            console.log(selectedTrack);
        }
    }, [selectedTrack]);

    // generate a table for the results
    const tableRows = results.tracks?.items.map((track: any) => {
        return (
            <tr key={track.id} onClick={() => handleClickTrack(track)}>
                <td>{track.name}</td>
                <td>{track.artists[0].name}</td>
                <td>{track.popularity}</td>
            </tr>
        );
    });
    if (!albumArt && !artists && !name){
    // if (false){
        return (
            <div className='flex flex-grow justify-center h-screen w-full'>
                <div className="bg-search-purple w-1/2 h-[50%] rounded-2xl">
                <h1>Find a song/album to review:</h1>
                <input
                    className='text-black'
                    type='search'
                    onChange={(e) => {
                        refresh(e.target.value);
                    }}
                ></input>
                <table>
                    <thead>
                        <tr>
                            <th>Track Title</th>
                            <th>Artist Name</th>
                            <th>Popularity</th>
                        </tr>
                    </thead>
                    <tbody>{tableRows}</tbody>
                </table>
                </div>
            </div>
        );
    }
    else if (selectedTrack){
        return (
            <div className='flex flex-col justify-center items-center min-h-screen w-full px-4'>
                <div className="bg-search-purple h-auto max-w-2xl md:h-[50%] rounded-2xl p-6 flex flex-col justify-between">
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {/* Left Side (Text + Stars) */}
                        <div className="flex flex-col items-center md:items-start md:text-left h-full">
                        <p className='text-lg mb-4 cursor-pointer self-start text-left w-full'>&larr; Back</p>

                            <h1 className='font-bold text-3xl text-center md:text-left'>{name}</h1>
                            <p className="italic text-xl text-center md:text-left">{artists}</p>

                            <div className='bg-white rounded-full flex justify-center items-center text-center w-2/5 max-w-xs h-9 text-lg mt-4 md:mt-auto'>
                                ⭐️⭐️⭐️⭐️⭐️
                            </div>
                        </div>

                        {/* Right Side (Larger Album Cover) */}
                        <div className='flex justify-center items-center'>
                            <img src={albumArt} className='rounded-2xl w-full max-w-sm h-auto' alt='album cover'/>
                        </div>
                    </div>
                    <div className='bg-white rounded-2xl h-40 w-full mt-7'></div>
                </div>
            </div>
        );
    }
}   