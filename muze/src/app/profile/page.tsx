'use client';
import AlbumArt from '@/components/album_art/album_art';
import Avatar from './settings/avatar';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getCurrentUser, updateUser } from '../api/user/route';
import { TextField } from '@mui/material';

export default function Profile() {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profile_pic, setProfilePic] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const session = useSession();
    if (!session || session.status === 'unauthenticated') {
        redirect(`/`);
    }

    useEffect(() => {
        async function loadUser() {
            try {
                const user = await getCurrentUser();
                if (user) {
                    if (user.profile_pic && user.profile_pic !== '') {
                        setAvatarUrl(user.profile_pic);
                        setProfilePic(user.profile_pic);
                    }
                    setUsername(user.username);
                    if (user.bio) {
                        setBio(user.bio);
                    }
                }
            } catch (error) {
                console.log('Error loading user: ', error);
            }
        }
        loadUser();
    });

    async function updateProfile() {
        const done = await updateUser(username, bio, file, avatarUrl);
        if (done) {
            alert('uploaded!');
        } else {
            alert('failed to upload');
        }
    }

    return (
        <div className='grid grid-flow-row auto-rows-max mb-[15%] mx-auto'>
            <div className='relative bg-secondary py-[4.3%] w-full'>
                <div className='absolute aspect-square rounded-full bg-tertiary top-[50%] left-[5%] w-[8%] mx-[13%]'></div>
            </div>
            {/* sm: md: lg: xl: */}
            {/* sm: text-sm md: text-base lg: text-lg xl: */}
            Modify profile: picture here
            <Avatar
                url={avatarUrl}
                size={150}
                onUpload={(file) => {
                    setFile(file);
                }}
            ></Avatar>
            Modify Username
            <TextField
                onChange={(e) => {
                    setUsername(e.target.value);
                }}
                title='Change username'
                className='bg-white'
                defaultValue={username}
            ></TextField>
            Modify bio
            <TextField
                onChange={(e) => {
                    setBio(e.target.value);
                }}
                title='Change bio'
                className='bg-white'
                defaultValue={bio}
            ></TextField>
            <button
                onClick={() => {
                    updateProfile();
                }}
            >
                Submit Profile Changes
            </button>
            <div className='mx-[15%]'>
                <div className='px-[5%] mt-[7%]'>
                    <h1 className='font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                        {username}
                        <span className='italic px-3 font-normal sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                            (she/her)
                        </span>
                    </h1>
                </div>
                {/* sm: md: lg: xl: */}
                {/* sm: text-sm md: text-base lg: text-lg xl: */}
                <div className='mx-[15%]'>
                    <div className='px-[5%] mt-[7%]'>
                        <h1 className='font-bold sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl'>
                            Maxine Wu
                            <span className='italic px-3 font-normal sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                                (she/her)
                            </span>
                        </h1>
                    </div>
                    <div className='px-[4%]'>
                        <p className='px-3 font-normal sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                            @maxinewuu
                        </p>
                    </div>
                    <div className='px-[4%] py-[2%]'>
                        <p className='px-3 font-normal sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                            lover of all things pop, kpop/cpop, and jazz &lt;3
                        </p>
                        <p className='px-3 italic sm:text-sm md:text-base lg:text-lg xl:text-xl'>
                            Most recently listened to:
                            <span className='underline px-[0.5%]'>Fallin'</span>
                            by Harry Styles
                        </p>
                    </div>
                    <div className='px-[4%] pb-[3%]'>
                        <p className='px-3'>
                            <span className='font-bold'>5 </span>
                            followers •<span className='font-bold'> 5 </span>
                            following
                        </p>
                    </div>
                    <div>
                        <div className='grid grid-cols-[1fr_1fr_1fr] px-[4%] gap-x-[8%] mb-[1%]'>
                            <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[80%] py-[1.25%] text-center'>
                                <span className='font-bold sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    latest
                                </span>
                            </div>
                            <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[80%] py-[1.25%] text-center'>
                                <span className='sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    reviews
                                </span>
                            </div>
                            <div className='justify-self-center bg-primary rounded-full mt-[2%] w-[80%] py-[1.25%] text-center'>
                                <span className='sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    concerts
                                </span>
                            </div>
                        </div>
                    </div>
                    <hr className='w-[95%] justify-self-center' />
                    <div className='px-[5%] mt-[2%]'>
                        <h1 className='font-bold sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                            Heard it here first...
                        </h1>
                    </div>
                    <div className='grid grid-cols grid-cols-[1fr_4fr] px-[5%] gap-8 mt-[1%] mb-[3%]'>
                        <AlbumArt hasTitle={true} type='song' />
                        <div className='relative'>
                            <div className='static bg-primary rounded-full mb-[2%] w-[15%] py-[0.5%] text-center'>
                                <span className='sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    album
                                </span>
                            </div>
                            <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                                stunning. absolutely stunning. no words.
                            </h2>
                            <h2 className='sm:text-sm md:text-base lg:text-lg xl:text-xl pt-[1%]'>
                                stunning. absolutely stunning. no words.
                            </h2>
                        </div>
                        <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                            stunning. absolutely stunning. no words.
                        </h2>
                        <h2 className='sm:text-sm md:text-base lg:text-lg xl:text-xl pt-[1%]'>
                            stunning. absolutely stunning. no words.
                        </h2>
                    </div>
                    <div className='grid grid-cols grid-cols-[1fr_4fr] px-[5%] gap-8 mt-[1%] mb-[3%]'>
                        <AlbumArt hasTitle={true} type='song' />
                        <div className='relative'>
                            <div className='static bg-primary rounded-full mb-[2%] w-[15%] py-[0.5%] text-center'>
                                <span className='sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    album
                                </span>
                            </div>
                            <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                                the best song ever. on repeat all the time.
                            </h2>
                            <h2 className='sm:text-sm md:text-base lg:text-lg xl:text-xl pt-[1%]'>
                                the way weezer writes is unmatched. their
                                lyricism on this album is top notch. buddy holly
                                and the sweater song are my top two songs.
                            </h2>
                        </div>
                        <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                            the best song ever. on repeat all the time.
                        </h2>
                        <h2 className='sm:text-sm md:text-base lg:text-lg xl:text-xl pt-[1%]'>
                            the way weezer writes is unmatched. their lyricism
                            on this album is top notch. buddy holly and the
                            sweater song are my top two songs.
                        </h2>
                    </div>
                    <div className='grid grid-cols grid-cols-[1fr_4fr] px-[5%] gap-8 mt-[1%] mb-[3%]'>
                        <AlbumArt hasTitle={true} type='song' />
                        <div className='relative'>
                            <div className='static bg-primary rounded-full mb-[2%] w-[15%] py-[0.5%] text-center'>
                                <span className='sm:text-xs md:text-xs lg:text-sm xl:text-base'>
                                    album
                                </span>
                            </div>
                            <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                                one of the most powerful bridges, ever.{' '}
                            </h2>
                            <h2 className='sm:text-sm md:text-base lg:text-lg xl:text-xl pt-[1%]'>
                                so so so so so good. weezer does it again, and
                                we're literally so obsessed. their vocals are
                                always on point, they do not disappoint here.
                            </h2>
                        </div>
                        <h2 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl'>
                            one of the most powerful bridges, ever.{' '}
                        </h2>
                        <h2 className='sm:text-sm md:text-base lg:text-lg xl:text-xl pt-[1%]'>
                            so so so so so good. weezer does it again, and we're
                            literally so obsessed. their vocals are always on
                            point, they do not disappoint here.
                        </h2>
                    </div>
                </div>
                <div className='px-[5%] mt-[2%]'>
                    <h1 className='sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold'>
                        Currently obsessed with...
                    </h1>
                </div>
                <div className='grid grid-cols-[1fr_1fr_1fr] px-[5%] gap-[8%] mt-[1%] mb-[3%]'>
                    <AlbumArt
                        hasTitle={true}
                        hasTypeSticker={true}
                        type='album'
                    />
                    <AlbumArt
                        hasTitle={true}
                        hasTypeSticker={true}
                        type='song'
                    />
                    <AlbumArt
                        hasTitle={true}
                        hasTypeSticker={true}
                        type='album'
                    />
                    <AlbumArt
                        hasTitle={true}
                        hasTypeSticker={true}
                        type='song'
                    />
                    <AlbumArt
                        hasTitle={true}
                        hasTypeSticker={true}
                        type='album'
                    />
                    <AlbumArt
                        hasTitle={true}
                        hasTypeSticker={true}
                        type='song'
                    />
                </div>
            </div>
        </div>
    );
}
