'use client';
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut, signIn } from 'next-auth/react';

export default function SignUp(){
    const router = useRouter();

    const logIn = async () => {
        await signIn('spotify', { redirect: false, callbackUrl: 'http://localhost:3000/' });
        router.push('/');
        console.log("AWESOME")
    }
    const searchParams = useSearchParams();
    const hasAccount = searchParams.get('hasAccount');
    console.log("has account", hasAccount)
    const { data: session, status } = useSession();

    if (!session || status !== 'authenticated') {
        if (hasAccount === 'true'){
            return (
                <div className='flex justify-center h-screen w-full'>
                    <div className="flex flex-col bg-white w-1/2 h-[50%] rounded-2xl text-primary items-center justify-center ">
                        <h1 className='text-center'>
                            join <span className='font-bold'>muze!</span>
                        </h1>
                        <p>where everyone listens</p>
                        <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[25%] py-[1.25%] text-center text-white'>
                            <button onClick={() => logIn()} >
                                <span className='font-bold sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    Sign in with Spotify
                                </span>
                            </button>
                        </div>
                        <p className='mt-10'>
                            Need to create an account?
                            <Link href={{
                                pathname: '/signup',
                                query: {
                                    hasAccount: false
                                }
                            }}>
                                <span className='font-bold'> Sign up!</span>
                            </Link>
                        </p>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className='flex justify-center h-screen w-full'>
                    <div className="flex flex-col bg-white w-1/2 h-[50%] rounded-2xl text-primary items-center justify-center ">
                        <h1 className='text-center'>
                            join <span className='font-bold'>muze!</span>
                        </h1>
                        <p>where everyone listens</p>
                        <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[25%] py-[1.25%] text-center text-white'>
                            <span className='font-bold sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                Sign up with Spotify
                            </span>
                        </div>
                        <div className="flex justify-center items-center w-full my-4">
                            <hr className="border-t border-gray-400 w-20" />
                            <span className="px-4 text-gray-600 font-medium">or</span>
                            <hr className="border-t border-gray-400 w-20" />
                        </div>
                        <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[25%] py-[1.25%] text-center text-white'>
                            <span className='font-bold sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                Create Account
                            </span>
                        </div>
                        <p className='mt-10'>
                            Already have an account?
                            <Link href={{
                                pathname: '/signup',
                                query: {
                                    hasAccount: true
                                }
                            }}>
                                <span className='font-bold'> Log in!</span>
                            </Link>
                        </p>
                    </div>
                </div>
            )
        }
    }
}