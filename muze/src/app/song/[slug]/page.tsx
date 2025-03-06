import AlbumArt from "@/components/album_art/album_art";
import Review from "@/components/review/review";
import { getReviewsForSong } from "@/app/api/review/route";

export default async function Song({params}: {params: Promise<{slug: string}>}){

    // slug = id of song, used for dynamic routing
    const {slug} = await params; 
    // replace when api to retrieve spotify data is implemented
    const track = await (await fetch(`https://api.spotify.com/v1/tracks/${slug}`, {
        headers: {
            Authorization: `Bearer ${process.env.SPOTIFY_AUTH_TOKEN}`
        }
    })).json()
    console.log("track", track);
    const title = track.name;
    const artists: string[] = (track.artists.map((item) => item.name)).join(", ");
    const albumCover = track.album.images[0].url;

    return (
        <div className="grid grid-flow-row auto-rows-max mb-[15%] mx-[auto]">
            <div>
                <div className="relative bg-secondary pt-[14%] z-0">
                </div>
                <div className='grid grid-cols-12 gap-16 mx-[5%]'>
                    <div className="col-span-3 -mt-[65%] ml-[5%]">
                        <AlbumArt type="song" imageUrl={albumCover} />
                    </div>
                    <div className='col-span-9 -mt-[19%] z-10'>
                        <div className="bg-primary rounded-3xl text-center place-content-center h-[13%] w-[18%] top-[4%] right-[4%]">album</div>
                        <h1 className='font-bold mt-[4%]'>{title}</h1>
                        <h1 className='text-xl'>{artists}</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-flow-row auto-rows-max my-[4%] mx-[6%]">
                <h1 className='text-3xl font-bold'>Reviews</h1>
                <div className='grid grid-cols-2'>
                    <div>
                        <Review songId={slug}/>
                    </div>
                    <div className='justify-content-center mx-[30%] my-[7%]'>
                        <div className='grid grid-cols-2 gap-4'>
                            <div className="bg-primary rounded-3xl text-center place-content-center h-16">❤️</div>
                            <div className="bg-primary rounded-3xl text-center place-content-center h-16">👀</div>
                        </div>
                        <div className="bg-primary rounded-3xl text-center place-content-center h-16 mt-3">add review</div>
                    </div>
                </div>
            </div>
        </div>
    )
}