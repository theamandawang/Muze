'use client';

import { useState } from 'react';
import Close from '@mui/icons-material/Close';
import SearchTracksView from '../reviews/SearchTracksView';
import AddReviewView from '../reviews/AddReviewView';
import SearchUsersView from '../follow/SearchUsersView';
import { Track, User } from '@spotify/web-api-ts-sdk';

export default function SearchModal({
    searchMode,
    closeModal,
}: {
    searchMode: boolean;
    closeModal: () => void;
}) {
    const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleOutsideClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).id === 'modal-background') {
            closeModal();
        }
    };
    // search songs/albums
    if (!searchMode) {
        return (
            <div
                id='modal-background'
                className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
                onClick={handleOutsideClick}
            >
                <div
                    className='w-full max-w-2xl sm:w-[80%] p-6 rounded-2xl shadow-lg relative bg-search-purple max-h-[90vh] min-h-[400px] overflow-y-auto'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button (only on search screen) */}
                    {!selectedTrack && (
                        <button
                            className='absolute top-3 right-3 text-white text-2xl hover:text-gray-300'
                            onClick={closeModal}
                            aria-label='Close'
                        >
                            <Close />
                        </button>
                    )}

                    {/* Show AddReviewView when a track is selected, otherwise show SearchTracksView */}
                    {selectedTrack ? (
                        <AddReviewView
                            track={selectedTrack}
                            onBack={() => setSelectedTrack(null)}
                            onDone={() => {
                                closeModal();
                            }}
                        />
                    ) : (
                        <div className='flex flex-col items-left p-10'>
                            <SearchTracksView
                                onTrackSelect={setSelectedTrack}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    } else {
        return (
            <div
                id='modal-background'
                className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'
                onClick={handleOutsideClick}
            >
                <div
                    className='w-full max-w-2xl sm:w-[80%] p-6 rounded-2xl shadow-lg relative bg-search-purple max-h-[90vh] min-h-[400px] overflow-y-auto'
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button (only on search screen) */}
                    {!selectedUser && (
                        <button
                            className='absolute top-3 right-3 text-white text-2xl hover:text-gray-300'
                            onClick={closeModal}
                            aria-label='Close'
                        >
                            <Close />
                        </button>
                    )}
                    <div className='flex flex-col items-left p-10'>
                        <SearchUsersView onUserSelect={setSelectedUser} />
                    </div>
                </div>
            </div>
        );
    }
}
