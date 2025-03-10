import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import SearchModal from "../search/searchModal";
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/MenuOutlined';
import ProfilePic from "../profile_pic/profile-pic";
import ProfileDropdown from "../profile_pic/ProfileDropdown";
import { PlusIcon } from "@radix-ui/react-icons";
import { useSession } from "next-auth/react";

import { getCurrentUserProfilePicture } from "@/app/api/user/route";
import checkClientSessionExpiry from "@/utils/checkClientSessionExpiry";

export default function MuzeHeader() {
    const { data: session, status } = useSession();
    if(!checkClientSessionExpiry(session, status)) {
        redirect('/');
    }
    
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchMode, setSearchMode] = useState(false); // false = search songs/albums, true = search users
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const [src, setSrc] = useState('/default-profile-pic.svg');

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);

        // use this to load the correct source for the user pfp.
        getCurrentUserProfilePicture().then((pfp) => {setSrc(pfp);});

        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <header className="sticky bg-[#0d001d] top-0 flex w-full px-8 pt-2 pb-2 relative justify-between items-center border-b border-gray-800 z-[9990]">
                {/* Left side: "muze" text & search bar */}
                <div className="flex flex-row gap-8 items-center mr-auto">
                    <Link href='/home'>
                        <h1 className="text-3xl font-bold text-white">muze</h1>
                    </Link>
                        <div 
                            className="bg-tertiary h-9 md:w-80 sm:w-60 border rounded-3xl shadow-md text-secondary flex items-center px-4 cursor-pointer space-x-3 relative"
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
                        
                        <span className="flex-grow">Search Muze</span>
                        <SearchIcon className="w-5 h-5 text-secondary" />
                    </div>
                </div>

                {/* Right side: Profile icon and review button */}
                <div className="flex flex-row gap-4 items-center ml-auto">
                    <Link href="/review">
                        <div className="flex items-center justify-center h-9 w-24 rounded-3xl bg-transparent transition duration-200 hover:bg-[#2B1B3D]">
                            <PlusIcon className="w-4 h-4 mr-1" />
                            <span className="text-xs font-bold">Review</span>
                        </div>
                    </Link>
                    <div className="relative w-8">
                        <ProfilePic 
                            key={src}
                            userId={session?.user?.id}
                            src={src}
                        />
                    </div>
                </div>
            </header>

            {/* Render search modal when open */}
            {isSearchOpen && <SearchModal searchMode={searchMode} closeModal={() => setIsSearchOpen(false)} />}
        </>
    );
}
