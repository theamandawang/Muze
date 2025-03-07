import { UpdateUser, UploadPhoto } from '@/db/UserUpdate';
import { supabase } from '@/lib/supabase/supabase';

jest.mock('@/lib/supabase/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn(() => ({
        update: jest.fn(),
      })),
    },
    from: jest.fn(() => ({
      update: jest.fn(() => ({
        match: jest.fn(),
      })),
    })),
  },
}));

describe('User Profile Update Services', () => {
  const mockUserId = 'user123';
  const mockUsername = 'testUser';
  const mockBio = 'This is my test bio';
  const mockProfilePic = 'https://example.com/pic.jpg';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('UpdateUser function', () => {
    it('updates user profile successfully', async () => {
      const mockUpdate = jest.fn();
      const mockMatch = jest.fn().mockResolvedValue({ error: null });
      
      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate.mockReturnValue({
          match: mockMatch
        }),
      });
      
      await UpdateUser(mockUserId, mockUsername, mockBio, mockProfilePic);
      
      expect(mockUpdate).toHaveBeenCalledWith({
        username: mockUsername,
        bio: mockBio,
        profile_pic: mockProfilePic
      });
      
      expect(mockMatch).toHaveBeenCalledWith({ id: mockUserId });
    });
    
    it('throws error when update fails', async () => {
      const mockUpdate = jest.fn();
      const mockMatch = jest.fn().mockResolvedValue({ 
        error: { message: 'Database error' } 
      });
      
      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate.mockReturnValue({
          match: mockMatch
        }),
      });
      
      await expect(UpdateUser(mockUserId, mockUsername, mockBio, mockProfilePic))
        .rejects
        .toThrow(`Error updating user info for ${mockUserId}`);
    });
  });
  
  describe('UploadPhoto function', () => {
    it('uploads photo successfully and returns the correct URL', async () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const filePath = `${mockUserId}/avatar.png`;
      
      (supabase.storage.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockResolvedValue({
          data: {
            path: filePath,
            fullPath: `avatars/${filePath}`
          },
          error: null
        })
      });
      
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://supabase.example.com';
      
      const result = await UploadPhoto(mockUserId, mockFile);
      
      expect(result).toBe('https://supabase.example.com/storage/v1/object/public/avatars/' + filePath);
    });
    
    it('throws error when upload fails', async () => {
      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      
      (supabase.storage.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'Upload failed' }
        })
      });
      
      await expect(UploadPhoto(mockUserId, mockFile))
        .rejects
        .toEqual({ message: 'Upload failed' });
    });
  });
});
