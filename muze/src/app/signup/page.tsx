export default function SignUp(){
    const hasAccount = true;
    if (hasAccount){
        return (
            <div className='flex justify-center h-screen w-full'>
                <div className="flex flex-col bg-white w-1/2 h-[50%] rounded-2xl text-primary items-center justify-center ">
                    <h1 className='text-center'>
                        join <span className='font-bold'>muze!</span>
                    </h1>
                    <p>where everyone listens</p>
                    <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[25%] py-[1.25%] text-center text-white'>
                        <span className='font-bold sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                            Sign in with Spotify
                        </span>
                    </div>
                    <p className='mt-10'>
                        Need to create an account?
                        <span className='font-bold'> Sign up!</span>
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
                        <span className='font-bold'> Log in!</span>
                    </p>
                </div>
            </div>
        )
    }
}