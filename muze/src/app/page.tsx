'use client';

import { redirect, useRouter } from "next/navigation";
import { SearchResults, SpotifyApi } from '@spotify/web-api-ts-sdk'; // use "@spotify/web-api-ts-sdk" in your own project
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { useSession, signOut, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import checkClientSessionExpiry from "@/utils/checkClientSessionExpiry";

export default function Home() {
    const router = useRouter();
    const {data: session, status} = useSession();

    const logIn = async () => {
        await signIn('spotify', { redirect: false, callbackUrl: 'http://localhost:3000/' });
        router.push('/');
    };

    if (!checkClientSessionExpiry(session, status)) {
        return (
            <div className='grid grid-cols-2 gap-x-10 items-start'>
                <div className='justify-self-end place-content-center h-full'>
                    <h1 className='text-7xl font-bold text-white'>muze</h1>
                    <h2>where everyone listens</h2>
                </div>
                <div>
                    <div className='h-screen place-content-center'>
                        <div className='bg-white text-black font-bold rounded-full w-lg sm:w-sm py-3 text-center'>
                            <Link href={{
                                pathname: '/signup',
                                query: {
                                    hasAccount: false
                                }
                            }}>
                                Sign up with Spotify
                            </Link>
                        </div>
                        <h1 className='font-bold text-lg mt-[5%] mb-[5%]'>Already have an account?</h1>
                        <div 
                            className="bg-primary text-white font-bold rounded-full w-lg sm:w-sm py-3 text-center cursor-pointer"
                            onClick={logIn} 
                        >
                            Sign in with Spotify
                        </div>
                    </div>
                </div>
            </div>
        );
    } else {
        router.push('/home');
    }
}
