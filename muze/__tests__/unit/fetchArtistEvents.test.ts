import { fetchArtistEvents } from '@/lib/ticketmaster/ticketMasterAPI';

jest.mock('build-url-ts', () => ({
  buildUrl: jest.fn().mockReturnValue('http://api.ticketmaster.com/events')
}));

describe('fetchArtistEvents', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('parses event data correctly on a successful fetch', async () => {
    const mockEvent = {
      name: 'Concert 1',
      _embedded: {
        venues: [
          { name: 'Venue 1', city: { name: 'City 1' }, country: { name: 'Country 1' } }
        ]
      },
      dates: { start: { localDate: '2023-06-01' } },
      images: [{ url: 'http://example.com/event.jpg' }],
      url: 'http://example.com/event1',
      description: 'Event description'
    };

    const mockResponse = {
      ok: true,
      json: async () => ({ _embedded: { events: [mockEvent] } })
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    const events = await fetchArtistEvents('Artist Name', 1);
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      Event_name: 'Concert 1',
      Location: 'Venue 1',
      City: 'City 1',
      Country: 'Country 1',
      Time: '2023-06-01',
      Picture: 'http://example.com/event.jpg',
      Url: 'http://example.com/event1',
      Description: 'Event description'
    });
  });

  it('throws an error when response is not ok', async () => {
    const mockResponse = { ok: false, status: 404 };
    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);
    await expect(fetchArtistEvents('Artist Name', 1)).rejects.toThrow();
  });
});
