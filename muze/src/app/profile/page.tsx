import AlbumArt from "@/components/album_art/album_art"

export default function Profile(){
    return (
        <div>
            <div className="grid grid-flow-row auto-rows-max mb-[15%] mx-auto">
                <div className="relative bg-secondary h-[10rem] w-full">
                    <div className="absolute aspect-square rounded-full bg-tertiary top-[50%] left-[5%] w-[10%]"></div>
                </div>
                    <div className="px-[5%] mt-[7%]">
                        <h1 className="text-5xl font-bold">Maxine Wu  
                            <span className="text-xl italic px-3 font-normal">(she/her)</span>
                        </h1>
                    </div>
                    <div className="px-[4%]">
                            <p className="text-xl px-3 font-normal">@maxinewuu</p>
                    </div>
                    <div className="px-[4%] py-[2rem]">
                            <p className="text-xl px-3 font-normal">lover of all things pop, kpop/cpop, and jazz &lt;3</p>
                            <p className="text-xl px-3 italic">Most recently listened to: 
                                <span className="underline px-[0.3rem]">Fallin'</span>
                                by Harry Styles
                            </p>
                    </div>
                    <div>
                        <div className="grid grid-cols-[1fr_1fr_1fr] px-[4%] gap-x-[8%] mb-[1%]">
                            <div className="justify-self-center bg-primary rounded-full mt-[2%] w-[80%] py-[1.25%] text-center">
                                <span className="font-bold">latest</span>
                            </div>
                            <div className="justify-self-center bg-primary rounded-full mt-[2%] w-[80%] py-[1.25%] text-center">
                                <span>reviews</span>
                            </div> 
                            <div className="justify-self-center bg-primary rounded-full mt-[2%] w-[80%] py-[1.25%] text-center">
                                <span>concerts</span>
                            </div>
                        </div>
                    </div>
                    <hr className="w-[95%] justify-self-center"/>
                    <div className="px-[5%] mt-[2%]">
                        <h1 className="text-3xl font-bold">Heard it here first...</h1> 
                    </div>
                    <div className="grid grid-cols grid-cols-[1fr_4fr] px-[5%] gap-8 mt-[1%] mb-[3%]">
                        <AlbumArt hasTitle={true} type="song"/>
                        <div className="relative">
                            <div className="static bg-primary rounded-full mb-[2%] w-[15%] py-[0.5%] text-center">
                                <span>album review</span>
                            </div>
                            <h2 className="text-3xl">stunning. absolutely stunning. no words.</h2>
                            <h2 className="text-xl pt-[1%]">stunning. absolutely stunning. no words.</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols grid-cols-[1fr_4fr] px-[5%] gap-8 mt-[1%] mb-[3%]">
                        <AlbumArt hasTitle={true} type="song"/>
                        <div className="relative">
                            <div className="static bg-primary rounded-full mb-[2%] w-[15%] py-[0.5%] text-center">
                                <span>album review</span>
                            </div>
                            <h2 className="text-3xl">the best song ever. on repeat all the time.</h2>
                            <h2 className="text-xl pt-[1%]">the way weezer writes is unmatched. their lyricism on this 
                                album is top notch. buddy holly and the sweater song are my top two songs.</h2>
                        </div>
                    </div>
                    <div className="grid grid-cols grid-cols-[1fr_4fr] px-[5%] gap-8 mt-[1%] mb-[3%]">
                        <AlbumArt hasTitle={true} type="song"/>
                        <div className="relative">
                            <div className="static bg-primary rounded-full mb-[2%] w-[15%] py-[0.5%] text-center">
                                <span>album review</span>
                            </div>
                            <h2 className="text-3xl">one of the most powerful bridges, ever. </h2>
                            <h2 className="text-xl pt-[1%]">so so so so so good. weezer does it again, and we're 
                                literally so obsessed. their vocals are always on point, they do not disappoint here.</h2>
                        </div>
                    </div>
                    <div className="px-[5%] mt-[2%]">
                        <h1 className="text-3xl font-bold">Currently obsessed with...</h1> 
                    </div>
                    <div className="grid grid-cols-[1fr_1fr_1fr] px-[5%] gap-[8%] mt-[1%] mb-[3%]">
                        <AlbumArt hasTitle={true} hasTypeSticker={true} type="album" />
                        <AlbumArt hasTitle={true} hasTypeSticker={true} type="song" />
                        <AlbumArt hasTitle={true} hasTypeSticker={true} type="album" />
                        <AlbumArt hasTitle={true} hasTypeSticker={true} type="song" />
                        <AlbumArt hasTitle={true} hasTypeSticker={true} type="album" />
                        <AlbumArt hasTitle={true} hasTypeSticker={true} type="song" />
                    </div>
            </div>
        </div>
    )
}