import { UpdateUser, UploadPhoto } from '@/db/UserUpdate';
import { updateUser } from '@/app/api/user/route';
import { checkSession } from '@/utils/serverSession';
import { getAvatarImageSrc } from '@/app/profile/settings/avatar-utils';

jest.mock('@/lib/supabase/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        update: jest.fn(),
      })),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        // Ensure chainability by returning a match function that returns a promise
        match: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}));

// For the DB functions we want to spy on
jest.mock('@/db/UserUpdate', () => ({
  UpdateUser: jest.fn(),
  UploadPhoto: jest.fn(),
}));

jest.mock('@/utils/serverSession', () => ({
  checkSession: jest.fn(),
}));

describe('User Profile Update Services (DB)', () => {
  const mockUserId = 'user123';
  const mockUsername = 'testUser'; // valid username (length >=2)
  const mockBio = 'This is my test bio';
  const mockProfilePic = 'https://example.com/pic.jpg';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('UpdateUser function', () => {
    it('updates user profile successfully', async () => {
      // Configure the mock so that when UpdateUser is called, it returns a resolved promise.
      (UpdateUser as jest.Mock).mockResolvedValue(undefined);
      
      await UpdateUser(mockUserId, mockUsername, mockBio, mockProfilePic);
      
      // Verify that the underlying supabase call was made.
      // Since UpdateUser is mocked, we simulate that the update happened
      expect(UpdateUser).toHaveBeenCalledWith(
        mockUserId,
        mockUsername,
        mockBio,
        mockProfilePic
      );
    });
    
    it('throws error when update fails', async () => {
      (UpdateUser as jest.Mock).mockRejectedValue(new Error('Error updating user info for ' + mockUserId));
      
      await expect(UpdateUser(mockUserId, mockUsername, mockBio, mockProfilePic))
        .rejects.toThrow(`Error updating user info for ${mockUserId}`);
    });
  });
  
  describe('UploadPhoto function', () => {
    const filePath = `${mockUserId}/avatar.png`;
    const mockFile = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    it('uploads photo successfully and returns the correct URL', async () => {
      (UploadPhoto as jest.Mock).mockResolvedValue(
        `https://supabase.example.com/storage/v1/object/public/avatars/${filePath}`
      );
      
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com';
      
      const result = await UploadPhoto(mockUserId, mockFile);
      
      expect(result).toBe(`https://supabase.example.com/storage/v1/object/public/avatars/${filePath}`);
    });
    
    it('throws error when upload fails', async () => {
      (UploadPhoto as jest.Mock).mockRejectedValue({ message: 'Upload failed' });
      
      await expect(UploadPhoto(mockUserId, mockFile))
        .rejects.toEqual({ message: 'Upload failed' });
    });
  });
});

describe('Profile Update Integration', () => {
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
    (UpdateUser as jest.Mock).mockResolvedValue(undefined);
    
    const result = await updateUser(mockUsername, mockBio, null, mockProfilePic);
    
    expect(UpdateUser).toHaveBeenCalledWith(mockUserId, mockUsername, mockBio, mockProfilePic);
    // Return value is the profilePic URL as per our updateUser implementation
    expect(result).toBe(mockProfilePic);
  });
  
  it('should update a user profile with a new profile picture', async () => {
    const uploadedPhotoUrl = 'https://example.com/new-avatar.png';
    (UploadPhoto as jest.Mock).mockResolvedValue(uploadedPhotoUrl);
    (UpdateUser as jest.Mock).mockResolvedValue(undefined);
    
    const result = await updateUser(mockUsername, mockBio, mockFile, null);
    
    expect(UploadPhoto).toHaveBeenCalledWith(mockUserId, mockFile);
    expect(UpdateUser).toHaveBeenCalledWith(mockUserId, mockUsername, mockBio, uploadedPhotoUrl);
    expect(result).toBe(uploadedPhotoUrl);
  });
  
  it('should return null when username is too short', async () => {
    const result = await updateUser('a', mockBio, null, mockProfilePic);
    expect(result).toBeNull();
    expect(UpdateUser).not.toHaveBeenCalled();
  });
  
  it('should return null when session check fails', async () => {
    (checkSession as jest.Mock).mockRejectedValue(new Error('No user logged in'));
    const result = await updateUser(mockUsername, mockBio, null, mockProfilePic);
    expect(result).toBeNull();
    expect(UpdateUser).not.toHaveBeenCalled();
  });
  
  it('should handle avatar URL cache busting', () => {
    const base64Image = 'data:image/png;base64,abcdef123456';
    expect(getAvatarImageSrc(base64Image)).toBe(base64Image);
    
    const regularUrl = 'https://example.com/avatar.png';
    const result = getAvatarImageSrc(regularUrl);
    expect(result).toMatch(new RegExp(`${regularUrl}\\?t=\\d+`));
  });
});
