'use client';

import { SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function Home() {
    const session = useSession();
    if (!session || session.status !== 'authenticated') {
        return (
            <div className='grid grid-cols-2 gap-x-10 items-start'>
                <div className='justify-self-end place-content-center h-full'>
                    <h1 className='text-7xl font-bold text-white'>muze</h1>
                    <h2>where everyone listens</h2>
                </div>
                <div>
                    <div className='h-screen place-content-center'>
                        <div className='bg-white text-black font-bold rounded-full w-[25%] py-[1.25%] text-center'>
                            <button onClick={() => signIn('spotify')}>
                                Sign up with Spotify
                            </button>
                        </div>
                        <h1 className='font-bold text-lg mt-[3%]'>Already have an account?</h1>
                        <div className='bg-primary text-white font-bold rounded-full w-[25%] py-[1.25%] mt-[1%] text-center '>
                            <button onClick={() => signIn('spotify')}>
                                Sign in with Spotify
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return (    
        <div>
            <p>Logged in as {session.data.user?.name}</p>
            <button onClick={() => signOut()}>Sign out</button>
            <SpotifySearch sdk={sdk} />
        </div>
    );
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi }) {
    const [results, setResults] = useState<SearchResults>({} as SearchResults);

    useEffect(() => {
        (async () => {
            const results = await sdk.search('The Beatles', ['artist']);
            setResults(() => results);
        })();
    }, [sdk]);

    // generate a table for the results
    const tableRows = results.artists?.items.map((artist) => {
        return (
            <tr key={artist.id}>
                <td>{artist.name}</td>
                <td>{artist.popularity}</td>
                <td>{artist.followers.total}</td>
            </tr>
        );
    });

    return (
        <>
            <h1>Spotify Search for The Beatles</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Popularity</th>
                        <th>Followers</th>
                    </tr>
                </thead>
                <tbody>{tableRows}</tbody>
            </table>
        </>
    );
}
