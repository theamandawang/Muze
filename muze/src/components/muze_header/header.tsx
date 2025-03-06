import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import SearchModal from "../search/searchModal";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import ProfilePic from "../profile_pic/profile-pic";

export default function MuzeHeader() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    let headerType: 'hasSearchbar' | 'hasReviewButton' | undefined;

    if (pathname === '/dashboard'){
        headerType = 'hasSearchbar';
    }
    else if (pathname === '/search'){
        headerType = 'hasReviewButton';
    }

    return (
        <>
            <header className="flex w-full px-8 pt-4 pb-4 relative justify-between items-center">
                {/* Left side: "muze" text & search bar */}
                <div className="flex flex-row gap-8 items-center mr-auto">
                    <Link href='/dashboard'>
                        <h1 className="text-3xl font-bold text-white">muze</h1>
                    </Link>
                    {headerType === 'hasSearchbar' && (
                        <div 
                            className="bg-tertiary h-10 md:w-80 sm:w-60 border rounded-3xl shadow-md text-secondary flex items-center px-4 cursor-pointer space-x-3"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            <MenuIcon className="w-5 h-5 text-secondary" /> {/* Menu icon */}
                            <span className="flex-grow">Search...</span>
                            <SearchIcon className="w-5 h-5 text-secondary" /> {/* Search icon */}
                        </div>
                    )}
                </div>

                {/* Right side: Profile icon and review button */}
                <div className="flex flex-row gap-8 items-center ml-auto">
                    {headerType === 'hasReviewButton' && (
                        <Link href=''>
                            <div className="flex bg-primary h-10 w-32 rounded-3xl justify-center items-center">
                                <span className='font-bold'>review</span>
                            </div>
                        </Link>
                    )}
                    <div className="relative w-16">
                        <ProfilePic />
                    </div>
                </div>
            </header>

            {/* Render search modal when open */}
            {isSearchOpen && <SearchModal closeModal={() => setIsSearchOpen(false)} />}
        </>
    );
}