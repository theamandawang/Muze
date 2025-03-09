import { render, screen } from '@testing-library/react';
import Home from '@/app/home/page';

describe('Home Page', () => {
  it('renders the greeting text', () => {
    render(<Home />);
    expect(screen.getByText(/popular with your friends/i)).toBeInTheDocument();
  });

  it('renders review section', () => {
    render(<Home />);
    expect(screen.getByText(/the latest on muze/i)).toBeInTheDocument();
  });
});
