import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MuzeHeader() {
    const pathname = usePathname();
    let headerType: 'hasSearchbar' | 'hasReviewButton' | undefined;

    if (pathname === '/dashboard'){
        headerType = 'hasSearchbar';
    }
    else if (pathname === '/search'){
        headerType = 'hasReviewButton';
    }

    return (
        <header className="flex w-full px-8 pt-4 pb-4 relative justify-between items-center">
            {/* Left side: "muze" text */}
            <Link href='/dashboard'>
                <div>
                    <h1 className="text-3xl font-bold text-white">muze</h1>
                </div>
            </Link>

            {/* Right side: Profile icon and conditional elements */}
            <div className="flex flex-row gap-8 items-center ml-auto">
                {headerType === 'hasSearchbar' && (
                    <Link href='/search'>
                        <div className="bg-white h-10 w-56 border rounded-lg shadow-md text-black">
                                Search...
                        </div>
                    </Link>
                )}
                {headerType === 'hasReviewButton' && (
                    <Link href=''>
                        <div className="flex bg-primary h-10 w-32 rounded-3xl justify-center items-center">
                            <span className='font-bold'>review</span>
                        </div>
                    </Link>
                )}
                <Link href='/profile'>
                    <div className="aspect-square rounded-full bg-tertiary w-16"></div>
                </Link>
            </div>
        </header>
    );
}