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

describe('Spotify API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getSpotifySongInfo', () => {
    it('fetches and transforms song data correctly', async () => {
      const mockTrackId = 'track123';
      const mockSpotifyResponse = {
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
      
      (sdk.tracks.get as jest.Mock).mockResolvedValue(mockSpotifyResponse);
      
      const result = await getSpotifySongInfo(mockTrackId);
      
      expect(sdk.tracks.get).toHaveBeenCalledWith(mockTrackId);
      expect(result).toEqual({
        songName: 'Test Song',
        artistNames: 'Artist One, Artist Two',
        imageUrl: 'https://example.com/large.jpg'
      });
    });
    
    it('handles API error gracefully', async () => {
      const mockTrackId = 'track123';
      const mockError = new Error('API Error');
      
      (sdk.tracks.get as jest.Mock).mockRejectedValue(mockError);
      
      console.error = jest.fn();
      
      const result = await getSpotifySongInfo(mockTrackId);
      
      expect(sdk.tracks.get).toHaveBeenCalledWith(mockTrackId);
      expect(console.error).toHaveBeenCalled();
      expect(result).toBeNull();
    });
    
    it('handles missing album images gracefully', async () => {
      const mockTrackId = 'track123';
      const mockSpotifyResponse = {
        id: mockTrackId,
        name: 'Test Song',
        artists: [
          { id: 'artist1', name: 'Artist One' }
        ],
        album: {
          id: 'album1',
          name: 'Test Album',
          images: [] // Empty images array
        }
      };
      
      (sdk.tracks.get as jest.Mock).mockResolvedValue(mockSpotifyResponse);
      
      const result = await getSpotifySongInfo(mockTrackId);
      
      expect(result).toEqual({
        songName: 'Test Song',
        artistNames: 'Artist One',
        imageUrl: undefined
      });
    });
    
    it('handles missing artists gracefully', async () => {
      const mockTrackId = 'track123';
      const mockSpotifyResponse = {
        id: mockTrackId,
        name: 'Test Song',
        artists: [], // Empty artists array
        album: {
          id: 'album1',
          name: 'Test Album',
          images: [
            { url: 'https://example.com/large.jpg', height: 640, width: 640 }
          ]
        }
      };
      
      (sdk.tracks.get as jest.Mock).mockResolvedValue(mockSpotifyResponse);
      
      const result = await getSpotifySongInfo(mockTrackId);
      
      expect(result).toEqual({
        songName: 'Test Song',
        artistNames: '',
        imageUrl: 'https://example.com/large.jpg'
      });
    });
  });
  
  describe('User Top Songs and Ticketmaster Events', () => {
    it('should update and retrieve user top songs', async () => {
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
      
      (updateTopSong as jest.Mock).mockResolvedValue({ success: true });
      (getTopSongs as jest.Mock).mockResolvedValue(mockTopSongsData);
      
      const updateResult = await updateUserTopSongs(mockUserId, mockTrackId, mockPosition);
      expect(updateResult).toEqual({ success: true });
      expect(updateTopSong).toHaveBeenCalledWith(mockUserId, mockTrackId, mockPosition);
      
      const topSongs = await getUserTopSongs(mockUserId);
      expect(topSongs).toEqual(mockTopSongsData);
      expect(getTopSongs).toHaveBeenCalledWith(mockUserId);
    });
    
    it('should fetch artist events from Ticketmaster API', async () => {
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
      
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockEventData
      });
      
      const result = await fetchArtistEvents(mockArtistName);
      
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('Event_name', 'Concert 1');
      expect(result[0]).toHaveProperty('Location', 'Venue 1');
      expect(result[0]).toHaveProperty('City', 'City 1');
      expect(result[1]).toHaveProperty('Event_name', 'Concert 2');
      expect(result[1]).toHaveProperty('Location', 'Venue 2');
      expect(global.fetch).toHaveBeenCalled();
    });
    
    it('should handle errors when fetching song information', async () => {
      const mockTrackId = 'invalid_track';
      const mockError = new Error('API Error');
      (sdk.tracks.get as jest.Mock).mockRejectedValue(mockError);
      
      console.error = jest.fn();
      
      const result = await getSpotifySongInfo(mockTrackId);
      
      expect(result).toBeNull();
      expect(console.error).toHaveBeenCalled();
      expect(sdk.tracks.get).toHaveBeenCalledWith(mockTrackId);
    });
    
    it('should handle missing album images in song data', async () => {
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
      
      (sdk.tracks.get as jest.Mock).mockResolvedValue(mockTrackData);
      
      const result = await getSpotifySongInfo(mockTrackId);
      
      expect(result).toEqual({
        songName: 'Test Song No Images',
        artistNames: 'Artist One',
        imageUrl: undefined
      });
    });
  });
});
