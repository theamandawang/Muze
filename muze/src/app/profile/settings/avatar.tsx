'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/supabase';
import Image from 'next/image';
import { uploadPhoto } from '@/app/api/user/route';

export default function Avatar({
    url,
    size,
    onUpload,
}: {
    url: string | null;
    size: number;
    onUpload: (url: string) => void;
}) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(url);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        async function downloadImage(path: string) {
            try {
                const { data, error } = await supabase.storage
                    .from('avatars')
                    .download(path);
                if (error) {
                    throw error;
                }

                const url = URL.createObjectURL(data);
                setAvatarUrl(url);
            } catch (error) {
                console.log('Error downloading image: ', error);
            }
        }

        if (url) downloadImage(url);
    }, [url, supabase]);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
        event
    ) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select a png to upload.');
            }
            if (event.target.files[0].type !== 'image/png') {
                alert('This is not a png');
                return;
                // throw new Error('This is not a png file.');
            }

            const file = event.target.files[0];

            const filePath = await uploadPhoto(file);

            await onUpload(event.target.files[0].name);
        } catch (error) {
            console.log(error);
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
                    src={avatarUrl}
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
                <label className='button primary block' htmlFor='single'>
                    {uploading ? 'Uploading ...' : 'Upload'}
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
