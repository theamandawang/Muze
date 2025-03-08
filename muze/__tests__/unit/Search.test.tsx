import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '@/app/search/page';
import '@testing-library/jest-dom';
import { SessionProvider } from 'next-auth/react';

jest.mock('@/lib/spotify-sdk/ClientInstance', () => ({
  __esModule: true,
  default: {
    search: jest.fn().mockResolvedValue({
      tracks: {
        items: [{ id: '1', name: 'Test Song', artists: [{ name: 'Test Artist' }], popularity: 50 }],
      },
    }),
  },
}));

describe('Search Page', () => {
  it('renders search input and performs search', async () => {
    render(
      <SessionProvider session={{ user: { name: 'Test User' }, expires: '9999' }}>
        <Search />
      </SessionProvider>
    );

    await waitFor(() => expect(screen.getByRole('searchbox')).toBeInTheDocument());

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'Test' } });

    await waitFor(() => {
      expect(screen.getByText('Test Song')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
  });
});
