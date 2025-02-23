'use client';
import React, { useEffect, useState } from 'react';
import SupabaseClient from '@/db/SupabaseClient';
import { UploadPhoto } from '@/db/UserUpdate';
import Image from 'next/image';

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
                const { data, error } = await SupabaseClient.storage
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
    }, [url, SupabaseClient]);

    const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (
        event
    ) => {
        try {
            setUploading(true);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];

            const filePath = await UploadPhoto(file);

            await onUpload(filePath);
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
