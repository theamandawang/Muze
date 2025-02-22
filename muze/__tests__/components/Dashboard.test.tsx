import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/dashboard/page';

describe('Dashboard Page', () => {
  it('renders the greeting text', () => {
    render(<Dashboard />);
    expect(screen.getByText(/Hey, Maxine!/i)).toBeInTheDocument();
  });

  it('renders review section', () => {
    render(<Dashboard />);
    expect(screen.getByText(/What your friends are saying.../i)).toBeInTheDocument();
  });
});
