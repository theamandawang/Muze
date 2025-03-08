import getSpotifySongInfo from '@/spotify-api/getSongInfo';
import sdk from '@/lib/spotify-sdk/ClientInstance';
import { updateUserTopSongs, getUserTopSongs } from '@/app/api/topSongs/route';
import { getTopSongs, updateTopSong } from '@/db/topSongs';
import { fetchArtistEvents } from '@/lib/ticketmaster/ticketMasterAPI';

jest.mock('@/lib/spotify-sdk/ClientInstance', () => ({
  __esModule: true,
  default: {
    tracks: {
      get: jest.fn()
    },
    search: jest.fn(),
    currentUser: {
      topItems: jest.fn()
    }
  }
}));

jest.mock('@/db/topSongs', () => ({
  getTopSongs: jest.fn(),
  updateTopSong: jest.fn()
}));

global.fetch = jest.fn();

describe('Spotify API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should fetch and transform song data correctly', async () => {
    // Setup mock data
    const mockTrackId = 'track123';
    const mockTrackData = {
      id: mockTrackId,
      name: 'Test Song',
      artists: [
        { id: 'artist1', name: 'Artist One' },
        { id: 'artist2', name: 'Artist Two' }
      ],
      album: {
        id: 'album1',
        name: 'Test Album',
        images: [
          { url: 'https://example.com/large.jpg', height: 640, width: 640 },
          { url: 'https://example.com/medium.jpg', height: 300, width: 300 },
          { url: 'https://example.com/small.jpg', height: 64, width: 64 }
        ]
      }
    };
    
    // Setup mock
    (sdk.tracks.get as jest.Mock).mockResolvedValue(mockTrackData);
    
    // Call the function
    const result = await getSpotifySongInfo(mockTrackId);
    
    // Verify results
    expect(result).toEqual({
      songName: 'Test Song',
      artistNames: 'Artist One, Artist Two',
      imageUrl: 'https://example.com/large.jpg'
    });
    expect(sdk.tracks.get).toHaveBeenCalledWith(mockTrackId);
  });
  
  it('should update and retrieve user top songs', async () => {
    // Setup mock data
    const mockUserId = 'user123';
    const mockTrackId = 'track123';
    const mockPosition = 1;
    
    const mockTopSongsData = [
      {
        rank: 1,
        created_at: '2023-01-01T00:00:00Z',
        songs: {
          spotify_id: mockTrackId,
          album_id: 'album123',
          title: 'Test Song',
          img: 'https://example.com/image.jpg'
        }
      }
    ];
    
    // Setup mocks
    (updateTopSong as jest.Mock).mockResolvedValue({ success: true });
    (getTopSongs as jest.Mock).mockResolvedValue(mockTopSongsData);
    
    // Update top song
    const updateResult = await updateUserTopSongs(mockUserId, mockTrackId, mockPosition);
    
    // Verify update results
    expect(updateResult).toEqual({ success: true });
    expect(updateTopSong).toHaveBeenCalledWith(mockUserId, mockTrackId, mockPosition);
    
    // Get top songs
    const topSongs = await getUserTopSongs(mockUserId);
    
    // Verify get results
    expect(topSongs).toEqual(mockTopSongsData);
    expect(getTopSongs).toHaveBeenCalledWith(mockUserId);
  });
  
  it('should fetch artist events from Ticketmaster API', async () => {
    // Setup mock data
    const mockArtistName = 'Test Artist';
    const mockEventData = {
      _embedded: {
        events: [
          {
            name: 'Concert 1',
            _embedded: {
              venues: [
                { name: 'Venue 1', city: { name: 'City 1' }, country: { name: 'Country 1' } }
              ]
            },
            dates: { start: { localDate: '2023-06-01' } },
            images: [{ url: 'https://example.com/image1.jpg' }],
            url: 'https://example.com/event1',
            description: 'Event 1 description'
          },
          {
            name: 'Concert 2',
            _embedded: {
              venues: [
                { name: 'Venue 2', city: { name: 'City 2' }, country: { name: 'Country 2' } }
              ]
            },
            dates: { start: { localDate: '2023-07-15' } },
            images: [{ url: 'https://example.com/image2.jpg' }],
            url: 'https://example.com/event2',
            description: 'Event 2 description'
          }
        ]
      }
    };
    
    // Setup mock
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockEventData
    });
    
    // Call the function
    const result = await fetchArtistEvents(mockArtistName);
    
    // Verify results
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty('Event_name', 'Concert 1');
    expect(result[0]).toHaveProperty('Location', 'Venue 1');
    expect(result[0]).toHaveProperty('City', 'City 1');
    expect(result[1]).toHaveProperty('Event_name', 'Concert 2');
    expect(result[1]).toHaveProperty('Location', 'Venue 2');
    expect(global.fetch).toHaveBeenCalled();
  });
  
  it('should handle errors when fetching song information', async () => {
    // Setup mock to throw error
    const mockTrackId = 'invalid_track';
    const mockError = new Error('API Error');
    (sdk.tracks.get as jest.Mock).mockRejectedValue(mockError);
    
    // Mock console.error
    console.error = jest.fn();
    
    // Call the function
    const result = await getSpotifySongInfo(mockTrackId);
    
    // Verify results
    expect(result).toBeNull();
    expect(console.error).toHaveBeenCalled();
    expect(sdk.tracks.get).toHaveBeenCalledWith(mockTrackId);
  });
  
  it('should handle missing album images in song data', async () => {
    // Setup mock data with missing images
    const mockTrackId = 'track_no_images';
    const mockTrackData = {
      id: mockTrackId,
      name: 'Test Song No Images',
      artists: [
        { id: 'artist1', name: 'Artist One' }
      ],
      album: {
        id: 'album1',
        name: 'Test Album',
        images: [] // Empty images array
      }
    };
    
    // Setup mock
    (sdk.tracks.get as jest.Mock).mockResolvedValue(mockTrackData);
    
    // Call the function
    const result = await getSpotifySongInfo(mockTrackId);
    
    // Verify results
    expect(result).toEqual({
      songName: 'Test Song No Images',
      artistNames: 'Artist One',
      imageUrl: undefined
    });
  });
});