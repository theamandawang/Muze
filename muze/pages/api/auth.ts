import type { NextApiRequest, NextApiResponse } from 'next'

const token = process.env.SPOTIFY_KEY

type ResponseData = {
  message: string | undefined
}

type SpotifyData = {
  
}

async function fetchWebApi(endpoint : string, method : string, body : JSON | null) : Promise<JSON>{
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body:JSON.stringify(body)
  });
  return await res.json();
}

async function getTopTracks() : Promise<JSON>{
  // Endpoint reference : https://developer.spotify.com/documentation/web-api/reference/get-users-top-artists-and-tracks
  return (await fetchWebApi(
    'v1/me/top/tracks?time_range=long_term&limit=5', 'GET', null
  )).items;
}

const topTracks = await getTopTracks();
console.log(
  topTracks?.map(
    ({name, artists}) =>
      `${name} by ${artists.map(artist => artist.name).join(', ')}`
  )
);
 
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {

  res.status(200).json({ message: token })
}