'use client';
import { SpotifyApi } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function History() {
    const session = useSession();

    if (!session || session.status !== 'authenticated') {
        return <p>No one is signed in ://</p>;
    } else {
        return (
            <div>
                <SpotifySearch sdk={sdk} />
            </div>
        );
    }
}

function SpotifySearch({ sdk }: { sdk: SpotifyApi }) {
    const [results, setResults] = useState<any>([] as any);

    useEffect(() => {
        (async () => {
            // I don't think I can get recently played via the sdk, so getting topItems just to see.
            const results = await sdk.currentUser.topItems('artists');
            console.log(results.items);
            setResults(() => results.items);
        })();
    }, [sdk]);

    // generate a table for the results
    const tableRows = results?.map((artist) => {
        console.log(artist);
        return <li key={artist.id}>{artist.name}</li>;
    });

    return (
        <>
            <h1>Spotify Search for The Beatles</h1>
            <ul>{tableRows}</ul>
        </>
    );
}
