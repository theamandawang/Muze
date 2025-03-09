import Link from 'next/link';
import { MediaType } from './review-types';

const MediaLink = ({ media_id, mediaType, mediaName }: {media_id: string, mediaType: MediaType, mediaName: string}) => {
  return (
    <Link 
        href={`/song/${media_id}`} 
        className="hover:underline cursor-pointer"
    >
        {mediaName}
    </Link>
  );
};

export default MediaLink;
