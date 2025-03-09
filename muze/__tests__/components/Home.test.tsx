import { render, screen } from '@testing-library/react';
import Home from '@/app/home/page';
import { SessionProvider } from 'next-auth/react';

describe('Home Page', () => {
  it('renders the greeting text', () => {
    render( <SessionProvider session={{ user: { name: 'Test User', expires_at: (Date.now() / 1000) + 3600}, status: 'authenticated'}}>
            <Home />
          </SessionProvider>);
    expect(screen.getByText(/Popular with Friends/i)).toBeInTheDocument();
  });

  it('renders review section', () => {
    render( <SessionProvider session={{ user: { name: 'Test User', expires_at: (Date.now() / 1000) + 3600}, status: 'authenticated'}}>
            <Home />
          </SessionProvider>);
    expect(screen.getByText(/Latest on Muze/i)).toBeInTheDocument();
  });
});
