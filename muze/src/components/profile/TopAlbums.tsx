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
          <p className="mb-4">You don't have any top albums yet.</p>
          <Link href="/profile/select-top-albums">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              Select Your Top 4 Songs
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default TopAlbums;