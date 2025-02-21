interface AlbumArtProps {
    hasTitle?: boolean;
    hasProfileSticker?: boolean;
    hasTypeSticker?: boolean;
    type?: "song" | "album" | "song review" | "album review";
}

export default function AlbumArt({ hasTitle = false, hasProfileSticker = false, hasTypeSticker = false, type }: AlbumArtProps) {
    
    return (
        <div className="relative bg-blue-500 aspect-square rounded-2xl">
            {hasProfileSticker && (
                <div className="absolute aspect-square rounded-full bg-tertiary -top-[16%] -left-[16%] w-1/3"></div>
            )}
            {hasTypeSticker && (type === "song" || type == "song review") && (
                <div className="absolute bg-secondary rounded-full text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">{type}</div>
            )}
            {hasTypeSticker && (type === "album" || type === "album review") && (
                <div className="absolute bg-primary rounded-xl text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">{type}</div>
            )}
            {hasTitle && (
                <div className="absolute h-[50%] w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                    <h2 className="font-semibold ml-[4%] mt-[2%] sm:text-base md:text-lg lg:text-xl xl:text-2xl">Buddy Holly</h2>
                    <h2 className=" font-semibold ml-[4%] mt-[1%] sm:text-xs md:text-base lg:text-lg xl:text-xl">Weezer</h2>
                </div>
            )}
        </div>
    )
}