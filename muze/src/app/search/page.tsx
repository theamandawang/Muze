'use client';

import { SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession } from 'next-auth/react';
import { useDebouncedCallback } from 'use-debounce';
import { useState } from 'react';

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

    // generate a table for the results
    const tableRows = results.tracks?.items.map((track) => {
        return (
            <tr key={track.id}>
                <td>{track.name}</td>
                <td>{track.artists[0].name}</td>
                <td>{track.popularity}</td>
            </tr>
        );
    });

    return (
        <>
            <h1>Spotify Search for: </h1>
            <input
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
        </>
    );
}
