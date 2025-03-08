import { fetchArtistEvents } from '@/lib/ticketmaster/ticketMasterAPI';

describe('fetchArtistEvents', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('fetches and parses events correctly', async () => {
    const fakeResponse = {
      ok: true,
      json: async () => ({
        _embedded: {
          events: [
            {
              name: 'Concert 1',
              _embedded: {
                venues: [
                  { name: 'Venue 1', city: { name: 'City 1' }, country: { name: 'Country 1' } }
                ]
              },
              dates: { start: { localDate: '2025-01-01' } },
              images: [{ url: 'https://example.com/image1.jpg' }],
              url: 'https://example.com/event1',
              description: 'Event 1 description'
            },
          ],
        },
      }),
    };
    (global.fetch as jest.Mock).mockResolvedValue(fakeResponse);
    const events = await fetchArtistEvents('Test Artist');
    expect(events).toHaveLength(1);
    expect(events[0]).toHaveProperty('Event_name', 'Concert 1');
  });

  it('throws an error when the fetch response is not OK', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    await expect(fetchArtistEvents('Test Artist')).rejects.toThrow();
  });
});
