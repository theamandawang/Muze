// userFlow.e2e.test.ts

jest.mock('@/db/UserUpdate', () => ({
    CreateUser: jest.fn(),
    UpdateUser: jest.fn(),
    UploadPhoto: jest.fn(),
  }));
  
  jest.mock('@/db/UserGet', () => ({
    GetUserById: jest.fn(),
    GetMultipleUsersById: jest.fn(),
    GetUsersByUsername: jest.fn(),
  }));
  
  jest.mock('@/utils/serverSession', () => ({
    checkSession: jest.fn(),
  }));
  
  import {
    createUser,
    updateUser,
    getCurrentUser,
    getUserById,
    getMultipleUsersById,
    getUsersByUsername,
    getCurrentUserProfilePicture,
  } from '@/app/api/user/route';
  import { CreateUser, UpdateUser, UploadPhoto } from '@/db/UserUpdate';
  import { GetUserById, GetMultipleUsersById, GetUsersByUsername } from '@/db/UserGet';
  import { checkSession } from '@/utils/serverSession';
  
  // A fake file helper for file upload simulation
  function createFakeFile(content: string, filename: string, type: string) {
    // In a browser-like environment, File is available.
    return new File([content], filename, { type });
  }
  
  describe('User End-to-End Flow', () => {
    const mockSession = {
      user: {
        id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        picture: 'http://example.com/pic.png',
        access_token: 'valid_token',
        token_type: 'Bearer',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        refresh_token: 'refresh_token',
        scope: 'user-read-email',
      },
    };
  
    beforeEach(() => {
      jest.clearAllMocks();
    });
  
    it('successfully creates a new user via createUser', async () => {
      (CreateUser as jest.Mock).mockResolvedValue(true);
      const token = {
        access_token: 'new_token',
        token_type: 'Bearer',
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        expires_in: 3600,
        refresh_token: 'new_refresh',
        scope: 'user-read-email',
        id: 'user456',
        name: 'New User',
        email: 'new@example.com',
        picture: 'http://example.com/newpic.png',
      };
  
      const result = await createUser(token);
      expect(CreateUser).toHaveBeenCalledWith(token);
      expect(result).toBe(true);
    });
  
    it('retrieves current user successfully when session is valid', async () => {
      (checkSession as jest.Mock).mockResolvedValue(mockSession);
      const mockUser = {
        id: 'user123',
        username: 'TestUser',
        bio: 'Hello there',
        profile_pic: 'http://example.com/pic.png',
      };
      (GetUserById as jest.Mock).mockResolvedValue(mockUser);
  
      const user = await getCurrentUser();
      expect(user).toEqual(mockUser);
      expect(GetUserById).toHaveBeenCalledWith('user123');
    });
  
    it('returns null for current user when session check fails', async () => {
      (checkSession as jest.Mock).mockRejectedValue(new Error('No user logged in'));
      const user = await getCurrentUser();
      expect(user).toBeNull();
    });
  
    it('updates user profile successfully with a new file upload', async () => {
      (checkSession as jest.Mock).mockResolvedValue(mockSession);
      const mockUploadedUrl = 'http://example.com/new-avatar.png';
      (UploadPhoto as jest.Mock).mockResolvedValue(mockUploadedUrl);
      (UpdateUser as jest.Mock).mockResolvedValue(undefined);
      const file = createFakeFile('dummy content', 'avatar.png', 'image/png');
  
      const result = await updateUser('UpdatedUser', 'New bio content', file, null);
      expect(UploadPhoto).toHaveBeenCalledWith('user123', file);
      expect(UpdateUser).toHaveBeenCalledWith('user123', 'UpdatedUser', 'New bio content', mockUploadedUrl);
      expect(result).toBe(mockUploadedUrl);
    });
  
    it('updates user profile successfully without a new file when an old profile_pic is provided', async () => {
      (checkSession as jest.Mock).mockResolvedValue(mockSession);
      (UpdateUser as jest.Mock).mockResolvedValue(undefined);
      const oldPicUrl = 'http://example.com/old-avatar.png';
  
      const result = await updateUser('UpdatedUser', 'Bio updated', null, oldPicUrl);
      expect(UpdateUser).toHaveBeenCalledWith('user123', 'UpdatedUser', 'Bio updated', oldPicUrl);
      expect(result).toBe(oldPicUrl);
    });
  
    it('returns null when username is too short', async () => {
      const result = await updateUser('A', 'Short bio', null, 'http://example.com/old-avatar.png');
      expect(result).toBeNull();
      expect(UpdateUser).not.toHaveBeenCalled();
    });
  
    it('retrieves a user by id successfully', async () => {
      const mockUser = {
        id: 'user123',
        username: 'TestUser',
        bio: 'Hello there',
        profile_pic: 'http://example.com/pic.png',
      };
      (GetUserById as jest.Mock).mockResolvedValue(mockUser);
  
      const user = await getUserById('user123');
      expect(user).toEqual(mockUser);
      expect(GetUserById).toHaveBeenCalledWith('user123');
    });
  
    it('retrieves multiple users by ids successfully', async () => {
      const usersArray = [
        { id: 'user123', username: 'UserOne', bio: 'Bio1', profile_pic: 'pic1.png' },
        { id: 'user456', username: 'UserTwo', bio: 'Bio2', profile_pic: 'pic2.png' },
      ];
      (GetMultipleUsersById as jest.Mock).mockResolvedValue(usersArray);
  
      const users = await getMultipleUsersById(['user123', 'user456']);
      expect(users).toEqual(usersArray);
      expect(GetMultipleUsersById).toHaveBeenCalledWith(['user123', 'user456']);
    });
  
    it('returns an empty array when no multiple users are found', async () => {
      (GetMultipleUsersById as jest.Mock).mockResolvedValue([]);
      const users = await getMultipleUsersById(['nonexistent']);
      expect(users).toEqual([]);
    });
  
    it('retrieves users by fuzzy username search and sorts by relevance', async () => {
      const searchResults = [
        {
          id: 'user789',
          username: 'Maxine',
          profile_pic: null,
          bio: null,
          created_at: '2023-03-01T00:00:00Z',
          email: 'maxine@example.com',
          relevance_score: 0.9,
        },
        {
          id: 'user101',
          username: 'Max',
          profile_pic: null,
          bio: null,
          created_at: '2023-03-02T00:00:00Z',
          email: 'max@example.com',
          relevance_score: 0.7,
        },
      ];
      (GetUsersByUsername as jest.Mock).mockResolvedValue(searchResults);
  
      const results = await getUsersByUsername('Max');
      expect(results).toEqual(searchResults);
      if (results) {
        expect(results[0].relevance_score).toBeGreaterThanOrEqual(results[1].relevance_score);
      }
    });
  
    it('returns the default profile picture when fetching current user profile picture fails', async () => {
      (checkSession as jest.Mock).mockResolvedValue(mockSession);
      // Simulate a failing fetch by returning an object with ok set to false
      global.fetch = jest.fn().mockResolvedValue({ ok: false });
      const defaultPic = '/default-profile-pic.svg';
  
      const result = await getCurrentUserProfilePicture();
      expect(result).toBe(defaultPic);
    });
  
    it('returns the current user profile picture when fetch succeeds', async () => {
      (checkSession as jest.Mock).mockResolvedValue(mockSession);
      const supabaseUrl = 'http://supabase.example.com';
      process.env.NEXT_PUBLIC_SUPABASE_URL = supabaseUrl;
      const expectedUrl = `${supabaseUrl}/storage/v1/object/public/avatars/user123/avatar.png`;
      global.fetch = jest.fn().mockResolvedValue({ ok: true });
  
      const result = await getCurrentUserProfilePicture();
      expect(result).toBe(expectedUrl);
    });
  });
  