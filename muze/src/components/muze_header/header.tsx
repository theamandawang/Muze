import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import SearchModal from "../search/searchModal";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import ProfilePic from "../profile_pic/profile-pic";

export default function MuzeHeader() {
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchMode, setSearchMode] = useState(false); // false = search songs/albums, true = search users
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    let headerType: 'hasSearchbar' | 'hasReviewButton' | undefined;
    if (pathname === '/dashboard') {
        headerType = 'hasSearchbar';
    } else if (pathname === '/search') {
        headerType = 'hasReviewButton';
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                            className="bg-tertiary h-10 md:w-80 sm:w-60 border rounded-3xl shadow-md text-secondary flex items-center px-4 cursor-pointer space-x-3 relative"
                            onClick={() => setIsSearchOpen(true)}
                        >
                            {/* Menu icon with dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <MenuIcon
                                    className="w-5 h-5 text-secondary cursor-pointer"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsDropdownOpen((prev) => !prev);
                                    }}
                                />
                                {isDropdownOpen && (
                                    <div className="absolute left-0 top-8 bg-white text-black rounded-md shadow-lg w-32 z-10">
                                        <button 
                                            className={`w-full px-4 py-2 text-left ${!searchMode ? "bg-gray-200" : ""}`}
                                            onClick={(e) => { setSearchMode(false); setIsDropdownOpen(false); e.stopPropagation() }}
                                        >
                                            Songs/Albums
                                        </button>
                                        <button 
                                            className={`w-full px-4 py-2 text-left ${searchMode ? "bg-gray-200" : ""}`}
                                            onClick={(e) => { setSearchMode(true); setIsDropdownOpen(false); e.stopPropagation() }}
                                        >
                                            Users
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <span className="flex-grow">Search...</span>
                            <SearchIcon className="w-5 h-5 text-secondary" />
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
            {isSearchOpen && <SearchModal searchMode={searchMode} closeModal={() => setIsSearchOpen(false)} />}
        </>
    );
}
