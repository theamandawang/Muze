'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Search } from 'lucide-react';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { SearchResults, Track, Album } from '@spotify/web-api-ts-sdk';
import Link from 'next/link';
import { useDebouncedCallback } from 'use-debounce';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SearchTracksViewProps {
    onTrackSelect: (track: Track | Album) => void;
}

export default function SearchTracksView({ onTrackSelect }: SearchTracksViewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResults>({} as SearchResults);
    const [isLoading, setIsLoading] = useState(false);

    const refresh = useDebouncedCallback(
        async (value) => {
            if (value === '') {
                setResults({} as SearchResults);
                return;
            }
            setIsLoading(true);
            try {
                const searchResults = await sdk.search(value, ['track', 'album']);
                setResults(searchResults);
            } catch (error) {
                console.error('Error fetching search results', error);
            } finally {
                setIsLoading(false);
            }
        },
        250 // delay of 250ms
    );

    return (
        <div className="w-full mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Review your next song/album</h1>
            <p className="text-sm mt-2">Rave about your favs and rant about your overplayed tracks</p>
            <form className="relative flex items-center gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); }}>
                <Input
                    className="w-full rounded-xl h-12"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        refresh(e.target.value);
                    }}
                    placeholder="Search for songs/albums..."
                />
                <Button type="submit" disabled={isLoading} className="px-4 py-2 h-12">
                    {isLoading ? <Loader2 className="animate-spin" /> : <Search />}
                </Button>
            </form>
            {(results?.tracks?.items.length > 0 || results?.albums?.items.length > 0) && (
                <Tabs defaultValue="tracks" className="mt-4">
                    <TabsList>
                        <TabsTrigger value="tracks" className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-primary/20 data-[state=active]:bg-primary data-[state=active]:text-white transition">
                            Songs
                        </TabsTrigger>
                        <TabsTrigger value="albums" className="px-4 py-2 rounded-lg font-semibold text-gray-700 hover:bg-primary/20 data-[state=active]:bg-primary data-[state=active]:text-white transition">
                            Albums
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="tracks">
                        {results.tracks?.items.map((track: Track) => (
                            <Card key={track.id} className="mb-2 hover:bg-primary/10 cursor-pointer" onClick={() => onTrackSelect(track)}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <p className="text-lg font-medium hover:underline">{track.name}</p>
                                    <span className="text-gray-600">Song • {track.artists[0].name} • {track.album.name}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                    <TabsContent value="albums">
                        {results.albums?.items.map((album: Album) => (
                            <Card key={album.id} className="mb-2 hover:bg-primary/10 cursor-pointer" onClick={() => onTrackSelect(album)}>
                                <CardContent className="p-4 flex justify-between items-center">
                                    <p className="text-lg font-medium hover:underline">{album.name}</p>
                                    <span className="text-gray-600">Album • {album.artists[0].name}</span>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>
            )}
        </div>
    );
}