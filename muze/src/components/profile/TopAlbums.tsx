import React from 'react';
import Link from 'next/link';
import MediaCover from '../review/AlbumCoverArt';

interface TopAlbumsProps {
  topAlbums: { id: string; name: string; coverArt: string }[];
}

const TopAlbums: React.FC<TopAlbumsProps> = ({ topAlbums }) => {
  return (
    <div className="p-4 rounded-lg shadow-md">
      {topAlbums.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {topAlbums.map((album) => (
            <MediaCover key={album.id} mediaCoverArt={album.coverArt} mediaName={album.name} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <p className="mb-4">No top albums yet.</p>
        </div>
      )}
    </div>
  );
};

export default TopAlbums;