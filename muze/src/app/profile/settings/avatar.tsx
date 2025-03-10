'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getCurrentUser, updateUser } from '@/app/api/user/route';
import { getAvatarImageSrc } from './avatar-utils'

export default function Avatar({
    url,
    size,
    onUpload,
}: {
    url: string | null;
    size: number;
    onUpload: (file: File) => void;
}) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const user = await getCurrentUser();
                if (user) {
                    console.log(user.profile_pic);
                    setAvatarUrl(user.profile_pic);
                }
            } catch (error) {
                console.log('Error downloading image: ', error);
            }
        }

        if (url) downloadImage(url);
    }, [url]);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
        event
    ) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }
            const file = event.target.files[0];

            if (file.size > 10e6) {
                alert('Your file must be less than 10 MB');
                throw new Error('File is too large.');
            }

            if (file.type !== 'image/png') {
                alert('You can only upload pngs!');
                throw new Error('You must select a png.');
            }

            // const fileURL = await updateUser(file);
            // if (fileURL) {
            //     onUpload(fileURL);
            // }
            const reader = new FileReader();

            reader.onloadend = () => {
                // Set the data URL of the image to display it
                setAvatarUrl(reader.result as string);
                onUpload(file);
            };

            // Read the file as a data URL
            reader.readAsDataURL(file);
        } catch (error) {
            alert('Error uploading avatar!');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            {avatarUrl ? (
                <Image
                    width={size}
                    height={size}
                    src={getAvatarImageSrc(avatarUrl)}
                    alt='Avatar'
                    className='avatar image'
                    style={{ height: size, width: size }}
                />
            ) : (
                <div
                    className='avatar no-image'
                    style={{ height: size, width: size }}
                />
            )}
            <div style={{ width: size }}>
                <label 
                    className='button primary block'
                    htmlFor='single'
                    style={{ fontSize: '13px', paddingBottom:'20px' }}
                >
                    {uploading ? 'Uploading ...' : 'Choose Photo'}
                </label>
                <input
                    style={{
                        visibility: 'hidden',
                        position: 'absolute',
                    }}
                    type='file'
                    id='single'
                    accept='image/*'
                    onChange={uploadAvatar}
                    disabled={uploading}
                />
            </div>
        </div>
    );
}
