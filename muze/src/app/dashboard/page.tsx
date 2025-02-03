export default function Dashboard(){
    return (
        <div className="grid grid-flow-row auto-rows-max">
            <div className="px-[12%]">
                <span className="text-3xl font-semibold">Hey, Maxine!</span>
            </div>
            <div className="grid grid-cols grid-cols-[1fr_5fr_5fr_5fr_1fr] px-[4.5%] gap-8 mt-[2%] items-center">
                <div className="bg-violet-500 h-6 rounded-full text-center">
                    &lt;
                </div>
                <div className="bg-blue-500 aspect-square rounded-2xl">
                    song 1
                </div>
                <div className="bg-blue-500 aspect-square rounded-2xl">
                    song 2
                </div>
                <div className="bg-blue-500 aspect-square rounded-2xl">
                    song 3
                </div>
                <div className="bg-violet-500 h-6 rounded-full text-center">
                    &gt;
                </div>
            </div>
            <div className="justify-self-center bg-violet-500 rounded-full mt-[2%] w-[25%] py-[1.25%] text-center">
                <span className="font-bold">review!</span>
            </div>
            <div className="px-[12%] mt-[6%]">
                <span className="text-3xl font-semibold">What your friends are saying...</span>
            </div>
        </div>
    )
}