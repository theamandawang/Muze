export default function Review() {
    return (
        <div className="flex items-start gap-3 w-full mt-[3%]">
            <div className="absolute w-12 h-12 rounded-full bg-tertiary flex-shrink-0 -ml-6 mt-2"></div>
            <div className="flex flex-col flex-1">
                <h2 className="text-lg font-semibold px-8">Amanda Wang</h2>
                <div className="rounded-xl bg-custom-fuchsia py-4 px-8">
                    <h2 className="text-xl mb-2">one of the best albums of 2023</h2>
                    <h3>i love laufey so much yay!</h3>
                </div>
            </div>
        </div>
    );
}