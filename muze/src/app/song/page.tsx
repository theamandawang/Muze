import AlbumArt from "@/components/album_art/album_art";
import Review from "@/components/review/review";

export default function Song(){
    return (
        <div className="grid grid-flow-row auto-rows-max mb-[15%] mx-[auto]">
            <div>
                <div className="relative bg-secondary pt-[14%] z-0">
                </div>
                <div className='grid grid-cols-12 gap-16 mx-[5%]'>
                    <div className="col-span-3 -mt-[65%] ml-[5%]">
                        <AlbumArt type="song"/>
                    </div>
                    <div className='col-span-9 -mt-[19%] z-10'>
                        <div className="bg-primary rounded-3xl text-center place-content-center h-[13%] w-[18%] top-[4%] right-[4%]">album</div>
                        <h1 className='font-bold mt-[4%]'>Blue Album</h1>
                        <h1 className='text-xl'>Weezer</h1>
                    </div>
                </div>
            </div>
            <div className="grid grid-flow-row auto-rows-max my-[4%] mx-[6%]">
                <h1 className='text-3xl font-bold'>Reviews</h1>
                <div className='grid grid-cols-2'>
                    <div>
                        <Review />
                        <Review />
                        <Review />
                        <Review />
                        <Review />
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