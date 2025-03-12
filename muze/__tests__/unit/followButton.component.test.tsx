import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FollowButton from '@/components/buttons/FollowButton';
import '@testing-library/jest-dom';

describe('FollowButton Component', () => {
  it('renders "Follow" when not following', () => {
    const toggleFollow = jest.fn();
    render(<FollowButton following={false} isLoading={false} toggleFollow={toggleFollow} />);
    expect(screen.getByText(/Follow/i)).toBeInTheDocument();
  });

  it('renders "Unfollow" when following', () => {
    const toggleFollow = jest.fn();
    render(<FollowButton following={true} isLoading={false} toggleFollow={toggleFollow} />);
    expect(screen.getByText(/Unfollow/i)).toBeInTheDocument();
  });

  it('calls toggleFollow on click', () => {
    const toggleFollow = jest.fn();
    render(<FollowButton following={false} isLoading={false} toggleFollow={toggleFollow} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(toggleFollow).toHaveBeenCalled();
  });
});
