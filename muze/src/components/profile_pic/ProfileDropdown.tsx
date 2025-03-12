'use client';

import { signOut } from 'next-auth/react';

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function ProfileDropdown() {
    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false, callbackUrl: 'https://muze-service-580541375163.us-central1.run.app/'}); // don't redirect immediately
        } catch (error) {
            console.error('Error signing out:', error);
        } 
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="w-full z-[9999]">    
                    <Image className="border-white" src='/default-profile-pic.svg' alt='profile pic' width={32} height={32}/>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1f0f30] absolute top-[15px] right-[-12px] shadow-lg rounded-md p-2 w-32 text-center">
                <DropdownMenuItem>
                    <Link href="/profile" className="w-full block px-2 py-1">
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <Link 
                        className="w-full px-2 py-1"
                        href="/"
                        onClick={() => {handleSignOut()}}
                    >
                        Log Out
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
