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
                <div className="relative bg-blue-500 aspect-square rounded-2xl">
                    <div className="absolute bg-secondary rounded-full text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">
                        song
                    </div>
                    <div className="absolute h-1/5 w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                        <h2 className="font-semibold ml-[4%] mt-[2%] text-2xl">Buddy Holly</h2>
                        <h2 className=" font-semibold ml-[4%] mt-[1%] text-xl">Weezer</h2>
                    </div>
                </div>
                <div className="relative bg-blue-500 aspect-square rounded-2xl">
                    <div className="absolute bg-secondary rounded-full text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">
                        song
                    </div>
                    <div className="absolute h-1/5 w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                        <h2 className="font-semibold ml-[4%] mt-[2%] text-2xl">Buddy Holly</h2>
                        <h2 className=" font-semibold ml-[4%] mt-[1%] text-xl">Weezer</h2>
                    </div>
                </div>
                <div className="relative bg-blue-500 aspect-square rounded-2xl">
                    <div className="absolute bg-primary rounded-xl text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">
                        album
                    </div>
                    <div className="absolute h-1/5 w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                        <h2 className="font-semibold ml-[4%] mt-[2%] text-2xl">Weezer (Blue Album)</h2>
                        <h2 className=" font-semibold ml-[4%] mt-[1%] text-xl">Weezer</h2>
                    </div>
                </div>
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
                <div className="relative bg-blue-500 aspect-square rounded-2xl">
                    <div className="absolute aspect-square rounded-full bg-tertiary -top-[16%] -left-[16%] w-1/3"></div>
                    <div className="absolute bg-primary rounded-xl text-center place-content-center h-[10%] w-[30%] top-[4%] right-[4%]">
                        album
                    </div>
                    <div className="absolute h-1/5 w-full bg-stone-950 bottom-0 rounded-b-2xl opacity-70">
                        <h2 className="font-semibold ml-[4%] mt-[2%] text-2xl">Weezer (Blue Album)</h2>
                        <h2 className=" font-semibold ml-[4%] mt-[1%] text-xl">Weezer</h2>
                    </div>
                </div>
            </div>
        </div>
    )
}