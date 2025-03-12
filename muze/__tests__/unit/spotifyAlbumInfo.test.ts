import getSpotifyAlbumInfo from '@/spotify-api/getAlbumInfo';

jest.mock('@/lib/spotify-sdk/ClientInstance', () => ({
  __esModule: true,
  default: {
    albums: { get: jest.fn() }
  }
}));

describe('getSpotifyAlbumInfo', () => {
  it('returns album info when sdk.albums.get resolves', async () => {
    const mockAlbum = {
      name: 'Test Album',
      artists: [{ name: 'Artist One' }, { name: 'Artist Two' }],
      images: [{ url: 'http://example.com/image.jpg' }]
    };
    const sdk = require('@/lib/spotify-sdk/ClientInstance').default;
    sdk.albums.get.mockResolvedValue(mockAlbum);

    const result = await getSpotifyAlbumInfo('album123');
    expect(result).toEqual({
      songName: 'Test Album',
      artistNames: 'Artist One, Artist Two',
      imageUrl: 'http://example.com/image.jpg'
    });
  });

  it('returns null when sdk.albums.get throws an error', async () => {
    const sdk = require('@/lib/spotify-sdk/ClientInstance').default;
    sdk.albums.get.mockRejectedValue(new Error('fail'));
    const result = await getSpotifyAlbumInfo('album123');
    expect(result).toBeNull();
  });
});
