'use client';
import Image, { StaticImageData } from "next/image";

interface AlbumArtOptions {
    hasTitle?: boolean;
    hasProfileSticker?: boolean;
    hasTypeSticker?: boolean;
    type?: "song" | "album";
}

interface AlbumArtProps extends AlbumArtOptions {
    title: string;
    artists: string;
    imageUrl: StaticImageData;
}

export default function AlbumArt({ 
    title, artists, imageUrl,
    hasTitle = false, 
    hasProfileSticker = false,
    hasTypeSticker = false, 
    type 
}: AlbumArtProps) {
    if (imageUrl){
        return (
            <div>
                <Image src={imageUrl} alt="album art" className="relative aspect-square rounded-2xl" width={640} height={640} />
                {hasProfileSticker && (
                    <div className="absolute aspect-square rounded-full bg-tertiary -top-[16%] -left-[16%] w-1/3"></div>
                )}
                {hasTypeSticker && (type === "song") && (
                    <div className="absolute bg-secondary rounded-full text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">{type}</div>
                )}
                {hasTypeSticker && (type === "album") && (
                    <div className="absolute bg-primary rounded-xl text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">{type}</div>
                )}
                {hasTitle && (
                    <div className="absolute h-[50%] w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                        <h2 className="font-semibold ml-[4%] mt-[2%] sm:text-base md:text-lg lg:text-xl xl:text-2xl">{title}</h2>
                        <h2 className=" font-semibold ml-[4%] mt-[1%] sm:text-xs md:text-base lg:text-lg xl:text-xl">{artists}</h2>
                    </div>
                )}
            </div>
        )
    }
    else {
        return (
            <div>
                <div className="bg-blue-500 relative aspect-square rounded-2xl">
                    {hasProfileSticker && (
                        <div className="absolute aspect-square rounded-full bg-tertiary -top-[16%] -left-[16%] w-1/3"></div>
                    )}
                    {hasTypeSticker && (type === "song") && (
                        <div className="absolute bg-secondary rounded-full text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">{type}</div>
                    )}
                    {hasTypeSticker && (type === "album") && (
                        <div className="absolute bg-primary rounded-xl text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">{type}</div>
                    )}
                    {hasTitle && (
                        <div className="absolute h-[50%] w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                            <h2 className="font-semibold ml-[4%] mt-[2%] sm:text-base md:text-lg lg:text-xl xl:text-2xl">{title}</h2>
                            <h2 className=" font-semibold ml-[4%] mt-[1%] sm:text-xs md:text-base lg:text-lg xl:text-xl">{artists}</h2>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}