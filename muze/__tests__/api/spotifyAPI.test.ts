import getSpotifySongInfo from '@/spotify-api/getSongInfo';
import sdk from '@/lib/spotify-sdk/ClientInstance';

jest.mock('@/lib/spotify-sdk/ClientInstance', () => ({
  __esModule: true,
  default: {
    tracks: {
      get: jest.fn(),
    },
  },
}));

describe('Spotify API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
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
