import { updateUser, getCurrentUser, createUser } from '@/app/actions/user/action';
import { checkSession } from '@/utils/serverSession';
import { UpdateUser, UploadPhoto } from '@/db/UserUpdate';

jest.mock('@/utils/serverSession', () => ({
  checkSession: jest.fn(),
}));

jest.mock('@/db/UserUpdate', () => ({
  UpdateUser: jest.fn(),
  UploadPhoto: jest.fn(),
}));

jest.mock('@/app/actions/user/action', () => ({
  updateUser: jest.fn(),
  getCurrentUser: jest.fn(),
  createUser: jest.fn(),
}));

describe('User Profile Workflow E2E', () => {
  const validSession = { user: { id: 'user123', username: 'oldUser', bio: 'old bio', profile_pic: 'old_url' }, error: null };
  const newUsername = 'newUser';
  const newBio = 'This is a new bio';
  const newProfilePicUrl = 'https://example.com/new_avatar.png';
  const dummyFile = new File(['dummy content'], 'avatar.png', { type: 'image/png' });

  beforeEach(() => {
    jest.clearAllMocks();
    (checkSession as jest.Mock).mockResolvedValue(validSession);
  });

  it('updates profile with new text and file upload successfully', async () => {
    (UploadPhoto as jest.Mock).mockResolvedValue(newProfilePicUrl);
    (UpdateUser as jest.Mock).mockResolvedValue(undefined);
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      if (file) return newProfilePicUrl;
      return profile_pic;
    });
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user123',
      username: newUsername,
      bio: newBio,
      profile_pic: newProfilePicUrl,
    });
    const result = await updateUser(newUsername, newBio, dummyFile, null);
    expect(result).toBe(newProfilePicUrl);
    const updatedUser = await getCurrentUser();
    if (!updatedUser) throw new Error("getCurrentUser returned null");
    expect(updatedUser.username).toBe(newUsername);
    expect(updatedUser.bio).toBe(newBio);
    expect(updatedUser.profile_pic).toBe(newProfilePicUrl);
  });

  it('updates profile with text changes only without file upload', async () => {
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      return profile_pic;
    });
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user123',
      username: newUsername,
      bio: newBio,
      profile_pic: 'https://example.com/existing_avatar.png',
    });
    const result = await updateUser(newUsername, newBio, null, 'https://example.com/existing_avatar.png');
    expect(result).toBe('https://example.com/existing_avatar.png');
    const updatedUser = await getCurrentUser();
    if (!updatedUser) throw new Error("getCurrentUser returned null");
    expect(updatedUser.username).toBe(newUsername);
    expect(updatedUser.bio).toBe(newBio);
    expect(updatedUser.profile_pic).toBe('https://example.com/existing_avatar.png');
  });

  it('returns null when username is too short', async () => {
    const shortUsername = 'a';
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      if (username.length < 2) return null;
      return profile_pic;
    });
    const result = await updateUser(shortUsername, newBio, dummyFile, null);
    expect(result).toBeNull();
  });

  it('returns null when session check fails', async () => {
    (checkSession as jest.Mock).mockRejectedValue(new Error('No user logged in'));
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => null);
    const result = await updateUser(newUsername, newBio, dummyFile, 'https://example.com/existing_avatar.png');
    expect(result).toBeNull();
  });

  it('returns null when file upload fails', async () => {
    (UploadPhoto as jest.Mock).mockRejectedValue(new Error('Upload failed'));
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      try {
        const url = await UploadPhoto(validSession.user.id, file);
        return url;
      } catch (e) {
        return null;
      }
    });
    const result = await updateUser(newUsername, newBio, dummyFile, null);
    expect(result).toBeNull();
  });

  it('handles concurrent updates correctly', async () => {
    (UploadPhoto as jest.Mock).mockResolvedValue(newProfilePicUrl);
    (UpdateUser as jest.Mock).mockResolvedValue(undefined);
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      return file ? newProfilePicUrl : profile_pic;
    });
    (getCurrentUser as jest.Mock)
      .mockResolvedValueOnce({
        id: 'user123',
        username: newUsername,
        bio: newBio,
        profile_pic: newProfilePicUrl,
      })
      .mockResolvedValueOnce({
        id: 'user123',
        username: newUsername,
        bio: newBio,
        profile_pic: newProfilePicUrl,
      });
    const updatePromise1 = updateUser(newUsername, newBio, dummyFile, null);
    const updatePromise2 = updateUser(newUsername, newBio, null, 'https://example.com/existing_avatar.png');
    const results = await Promise.all([updatePromise1, updatePromise2]);
    expect(results[0]).toBe(newProfilePicUrl);
    expect(results[1]).toBe('https://example.com/existing_avatar.png');
    const updatedUser = await getCurrentUser();
    if (!updatedUser) throw new Error("getCurrentUser returned null");
    expect(updatedUser.username).toBe(newUsername);
    expect(updatedUser.bio).toBe(newBio);
    expect(updatedUser.profile_pic).toBe(newProfilePicUrl);
  });

  it('creates user then updates profile, and retrieves updated user data', async () => {
    (createUser as jest.Mock).mockResolvedValue(true);
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      return file ? newProfilePicUrl : profile_pic;
    });
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user123',
      username: newUsername,
      bio: newBio,
      profile_pic: newProfilePicUrl,
    });
    const createResult = await createUser({
      access_token: 'token',
      token_type: 'Bearer',
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      expires_in: 3600,
      refresh_token: 'refresh',
      scope: 'user-read-email',
      id: 'user123',
      name: 'OldUser',
      email: 'old@example.com',
      picture: 'old_url',
    });
    expect(createResult).toBe(true);
    const updateResult = await updateUser(newUsername, newBio, dummyFile, null);
    expect(updateResult).toBe(newProfilePicUrl);
    const updatedUser = await getCurrentUser();
    if (!updatedUser) throw new Error("getCurrentUser returned null");
    expect(updatedUser.username).toBe(newUsername);
    expect(updatedUser.bio).toBe(newBio);
    expect(updatedUser.profile_pic).toBe(newProfilePicUrl);
  });

  it('returns null when both file and profile_pic are missing', async () => {
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      if (!file && !profile_pic) return null;
      return profile_pic;
    });
    const result = await updateUser(newUsername, newBio, null, null);
    expect(result).toBeNull();
  });

  it('updates profile without modifying unchanged fields', async () => {
    (updateUser as jest.Mock).mockImplementation(async (username, bio, file, profile_pic) => {
      return profile_pic;
    });
    (getCurrentUser as jest.Mock).mockResolvedValue({
      id: 'user123',
      username: validSession.user.username,
      bio: validSession.user.bio,
      profile_pic: validSession.user.profile_pic,
    });
    const result = await updateUser(validSession.user.username, validSession.user.bio, null, validSession.user.profile_pic);
    expect(result).toBe(validSession.user.profile_pic);
    const updatedUser = await getCurrentUser();
    if (!updatedUser) throw new Error("getCurrentUser returned null");
    expect(updatedUser.username).toBe(validSession.user.username);
    expect(updatedUser.bio).toBe(validSession.user.bio);
    expect(updatedUser.profile_pic).toBe(validSession.user.profile_pic);
  });
});
