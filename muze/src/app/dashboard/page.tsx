import AlbumArt from "@/components/album_art/album_art"

export default function Dashboard(){
    return (
        <div className="grid grid-flow-row auto-rows-max">
            <div className="px-[12%]">
                <span className="text-3xl font-semibold">Hey, Maxine!</span>
            </div>
            <div className="grid grid-cols grid-cols-[1fr_5fr_5fr_5fr_1fr] px-[4.5%] gap-8 mt-[2%] items-center">
                <div className="bg-primary h-6 rounded-full text-center">
                    &lt;
                </div>
                <AlbumArt hasTitle={true} hasTypeSticker={true} type="song"/>
                <AlbumArt hasTitle={true} hasTypeSticker={true} type="song"/>
                <AlbumArt hasTitle={true} hasTypeSticker={true} type="album"/>
                <div className="bg-primary h-6 rounded-full text-center">
                    &gt;
                </div>
            </div>
            <div className="justify-self-center bg-primary rounded-full mt-[2%] w-[25%] py-[1.25%] text-center">
                <span className="font-bold">review!</span>
            </div>
            <div className="px-[12%] mt-[6%]">
                <span className="text-3xl font-semibold">What your friends are saying...</span>
            </div>
            <div className="grid grid-cols grid-cols-[2fr_4fr] px-[15%] gap-8 mt-[5%] items-center">
                <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="song"/>
            </div>
        </div>
    )
}