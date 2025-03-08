import { updateUser, getCurrentUser } from '@/app/api/user/route';
import { UpdateUser, UploadPhoto } from '@/db/UserUpdate';
import { checkSession } from '@/utils/serverSession';
import { getAvatarImageSrc } from '@/app/profile/settings/avatar-utils';

jest.mock('@/db/UserUpdate', () => ({
  UpdateUser: jest.fn(),
  UploadPhoto: jest.fn()
}));

jest.mock('@/utils/serverSession', () => ({
  checkSession: jest.fn()
}));

describe('Profile Update Integration Tests', () => {
  const mockUserId = 'user123';
  const mockUsername = 'NewUsername';
  const mockBio = 'This is my updated bio';
  const mockProfilePic = 'https://example.com/profile.png';
  const mockFile = new File(['testcontent'], 'avatar.png', { type: 'image/png' });
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    (checkSession as jest.Mock).mockResolvedValue({
      user: { id: mockUserId, name: 'OldUsername' }
    });
  });
  
  it('should update a user profile with text changes only', async () => {
    // Setup mocks
    (UpdateUser as jest.Mock).mockResolvedValue(undefined);
    
    // Call the function
    const result = await updateUser(mockUsername, mockBio, null, mockProfilePic);
    
    // Verify results
    expect(UpdateUser).toHaveBeenCalledWith(mockUserId, mockUsername, mockBio, mockProfilePic);
    expect(result).toBe(mockProfilePic);
  });
  
  it('should update a user profile with a new profile picture', async () => {
    // Setup mocks
    const uploadedPhotoUrl = 'https://example.com/new-avatar.png';
    (UploadPhoto as jest.Mock).mockResolvedValue(uploadedPhotoUrl);
    (UpdateUser as jest.Mock).mockResolvedValue(undefined);
    
    // Call the function
    const result = await updateUser(mockUsername, mockBio, mockFile, null);
    
    // Verify results
    expect(UploadPhoto).toHaveBeenCalledWith(mockUserId, mockFile);
    expect(UpdateUser).toHaveBeenCalledWith(mockUserId, mockUsername, mockBio, uploadedPhotoUrl);
    expect(result).toBe(uploadedPhotoUrl);
  });
  
  it('should return null when username is too short', async () => {
    // Call the function with a short username
    const result = await updateUser('a', mockBio, null, mockProfilePic);
    
    // Verify results
    expect(result).toBeNull();
    expect(UpdateUser).not.toHaveBeenCalled();
  });
  
  it('should return null when session check fails', async () => {
    // Setup mocks
    (checkSession as jest.Mock).mockRejectedValue(new Error('No user logged in'));
    
    // Call the function
    const result = await updateUser(mockUsername, mockBio, null, mockProfilePic);
    
    // Verify results
    expect(result).toBeNull();
    expect(UpdateUser).not.toHaveBeenCalled();
  });
  
  it('should handle avatar URL cache busting', () => {
    // Test base64 image URL
    const base64Image = 'data:image/png;base64,abcdef123456';
    expect(getAvatarImageSrc(base64Image)).toBe(base64Image);
    
    // Test regular URL with cache busting
    const regularUrl = 'https://example.com/avatar.png';
    const result = getAvatarImageSrc(regularUrl);
    expect(result).toMatch(new RegExp(`${regularUrl}\\?t=\\d+`));
  });
});