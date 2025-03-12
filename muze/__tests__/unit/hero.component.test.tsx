import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '@/components/hero/Hero';

describe('Hero Component', () => {
  it('renders display name and album covers', () => {
    const albumArts = ['cover1.png', 'cover2.png'];
    render(<Hero displayName="TestUser" albumArts={albumArts} />);
    expect(screen.getByText(/hey TestUser!/i)).toBeInTheDocument();
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('renders without album covers', () => {
    render(<Hero displayName="NoAlbums" />);
    expect(screen.getByText(/hey NoAlbums!/i)).toBeInTheDocument();
  });
});
