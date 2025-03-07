import React from 'react';

export interface MediaCoverProps {
    mediaCoverArt: string;
    mediaName: string;
}

const MediaCover: React.FC<MediaCoverProps> = ({ mediaCoverArt, mediaName }) => {
    return (
        <img
            src={mediaCoverArt}
            alt={`${mediaName} cover`}
            className="w-1/6 min-w-[150px] object-cover rounded-lg"
        />
    );
};

export default MediaCover;
