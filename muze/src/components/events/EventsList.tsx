import checkClientSessionExpiry from "@/utils/checkClientSessionExpiry";
import { Card } from "@mui/material";
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchArtistEvents } from "@/lib/ticketmaster/ticketMasterAPI";

export default function Events() {

    const { data: session, status } = useSession();
    if (!checkClientSessionExpiry(session, status)) {
        redirect(`/`);
    } else {
        return (
            <div>
                <EventsList sdk={sdk} />
            </div>
        );
    }
}

function EventsList({ sdk }: { sdk: SpotifyApi }) {

    const [results, setResults] = useState<string[]>([]);
    const [dummyEvents, setDummyEvents] = useState<any[]>([]);
    
    useEffect(() => {
        (async () => {
            const results = await sdk.currentUser.topItems('artists', 'short_term', 4);
            const names = results.items.map((item: { name: string }) => item.name);
            try {
                const events = 
                    await 
                    Promise.all(names.map((name) => {
                        return fetchArtistEvents(name, 3);
                    }));
                const flatEvents = events.flat();

                setDummyEvents(flatEvents);
                setResults(names);
                
            } catch(err) {
                console.log(err);
            }
        })();

    }, [sdk]);

    return (
        <Card className="p-4">
            <h1 className="text-xl font-bold mb-4">Upcoming Events</h1>
            {dummyEvents.length > 0 ? (
                dummyEvents.map((event, index) => (
                    <div key={index} className="mb-4 border-b pb-4">
                        <img src={event.Picture} alt={event.Event_name} className="w-32 h-32 object-cover rounded-lg mb-2" />
                        <p className="font-semibold text-lg">{event.Event_name}</p>
                        <p>{event.Time}</p>
                        <p>{event.Location}, {event.City}, {event.Country}</p>
                        <a href={event.URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">More Info</a>
                    </div>
                ))
            ) : (
                <p>No upcoming events.</p>
            )}
        </Card>
    );
}
