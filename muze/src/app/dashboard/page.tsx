import AlbumArt from "@/components/album_art/album_art"

export default function Dashboard(){
    return (
        <div className="grid grid-flow-row auto-rows-max mb-[15%]">
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
            <div className="grid grid-cols grid-cols-[2fr_4fr] px-[15%] gap-8 mt-[5%] mb-[7%]">
                <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="song"/>
                <div>
                    <h2 className="text-3xl">stunning. absolutely stunning. no words.</h2>
                    <h2 className="text-xl pt-[1%]">stunning. absolutely stunning. no words.</h2>
                </div>
            </div>
            <div className="grid grid-cols grid-cols-[2fr_4fr] px-[15%] gap-8 mb-[7%]">
                <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="song"/>
                <div>
                    <h2 className="text-3xl">a must listen</h2>
                    <h2 className="text-xl pt-[1%]">top-tier vocals and top-tier writing</h2>
                </div>
            </div>
            <div className="grid grid-cols grid-cols-[2fr_4fr] px-[15%] gap-8 mb-[3%]">
                <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="song"/>
                <div>
                    <h2 className="text-3xl">i love weezer soooo much ahhh</h2>
                    <h2 className="text-xl pt-[1%]">buddy holly somehow manages to top everything i know about love, and i can't wait to hear it live</h2>
                </div>
            </div>
            <div className="relative mx-[4.5%] px-[4.5%]">
                <div className="absolute bg-primary h-8 rounded-full text-center place-content-center w-[10%] right-0">
                        see more &gt;&gt;
                </div>
            </div>
            <div className="px-[12%] mt-[6%]">
                <span className="text-3xl font-semibold">What's popular on Muze...</span>
            </div>
            <div className="grid grid-cols grid-cols-[1fr_1fr] px-[18%] gap-x-[18%] gap-y-[9%] mt-[7%]">
                <div>
                    <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="album review"/>
                    <div className="pt-[3%]">
                        <h2 className="text-3xl">what a work of art</h2>
                        <p className="text-xl pt-[1%]">if weezer has a million fans, then i am one of them. if weezer has
                            ten fans, then i am one of them. if weezer has only one fan then that is me. if weezer has no
                            fans, then that means i am no longer on this earth. if the world is against weezer, then i am
                            against the world. </p>
                    </div>
                </div>
                <div>
                    <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="song review"/>
                    <div className="pt-[3%]">
                        <h2 className="text-3xl">stunning. absolutely stunning. no words.</h2>
                        <p className="text-xl pt-[1%]">alksdjfklsjd soooo good. like literally sooooooo good</p>
                    </div>
                </div>
                <div>
                    <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="album review"/>
                    <div className="pt-[3%]">
                        <h2 className="text-3xl">the comfort album we all need sometimes</h2>
                        <p className="text-xl pt-[1%]">hits really hard sometimes tbh</p>
                    </div>
                </div>
                <div>
                    <AlbumArt hasTitle={true} hasProfileSticker={true} hasTypeSticker={true} type="song review"/>
                    <div className="pt-[3%]">
                        <h2 className="text-3xl">this album is peak</h2>
                        <p className="text-xl pt-[1%]">one of the most reflective, thoughtful pieces albums i’ve listened
                            to in a while. quitely has so much stronger. really enjoyed drunk, running, all falls down, 
                            and you forced me to. </p>
                    </div>
                </div>
            </div>
        </div>
    )
}