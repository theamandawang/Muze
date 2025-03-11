'use server';
import { buildUrl } from 'build-url-ts';

if (!process.env.TICKET_MASTER_API_KEY) {
    throw new Error('No TICKET_MASTER_API_KEY');
}

export async function fetchArtistEvents(artistName: string, size: number = 10): Promise<any> {
    const apiUrl = buildUrl('https://app.ticketmaster.com', {
        path: 'discovery/v2/events.json', 
        queryParams: {
            keyword: artistName, 
            size: size, 
            apikey: process.env.TICKET_MASTER_API_KEY
        }
    }); 
    
    try {
        const response = await fetch(apiUrl, { method: "GET" });
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();


        const list_of_events = data?._embedded?.events?.slice(0,100) || [];
        const parsed_events = []; 

        for (let i = 0; i < list_of_events.length; i++) {
            const event = list_of_events[i];
        
            // Extracting event details
            const eventName = event.name;
            const location = event._embedded?.venues?.[0]?.name || "";
            const city = event._embedded?.venues?.[0]?.city?.name || ""; 
            const country = event._embedded?.venues?.[0]?.country?.name || ""; 
            const time = event.dates?.start?.localDate || "";
            const picture = event.images?.[0]?.url || "";
            const url_event = event?.url || ""; 
            const description = event?.description || ""; 
        

            parsed_events.push(
                {
                    Event_name: eventName,
                    Location: location,
                    City: city, 
                    Country: country, 
                    Time: time,
                    Picture: picture, 
                    Url: url_event, 
                    Description: description
                }
            );
        }

        console.log(parsed_events)
        return parsed_events;

    } catch (error) {
        console.error("Error fetching event data:", error);
        throw error;
    }
}