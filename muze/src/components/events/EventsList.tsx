import checkClientSessionExpiry from "@/utils/checkClientSessionExpiry";
import { Card } from "@mui/material";
import { SpotifyApi } from '@spotify/web-api-ts-sdk';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { useEffect, useState } from "react";

const dummyEvents = [
  {
    Event_name: "Rock Fest 2025",
    Location: "Madison Square Garden",
    City: "New York",
    Country: "USA",
    Time: "March 15, 2025, 8:00 PM",
    Picture: "https://via.placeholder.com/150",
    URL: "https://example.com/rockfest2025",
  },
  {
    Event_name: "Indie Vibes",
    Location: "The Roxy",
    City: "Los Angeles",
    Country: "USA",
    Time: "April 2, 2025, 7:30 PM",
    Picture: "https://via.placeholder.com/150",
    URL: "https://example.com/indievibes",
  },
  {
    Event_name: "Jazz Nights",
    Location: "Blue Note",
    City: "New York",
    Country: "USA",
    Time: "May 10, 2025, 9:00 PM",
    Picture: "https://via.placeholder.com/150",
    URL: "https://example.com/jazznights",
  },
];

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
    
    useEffect(() => {
        (async () => {
            const results = await sdk.currentUser.topItems('artists');
            const names = results.items.map((item: { name: string }) => item.name);
            setResults(names);
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
