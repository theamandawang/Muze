import { getAvatarImageSrc } from '@/app/profile/settings/avatar-utils';

describe('getAvatarImageSrc', () => {
  it('should return a base64 image unchanged', () => {
    const base64Image = 'data:image/png;base64,abcdef';
    expect(getAvatarImageSrc(base64Image)).toBe(base64Image);
  });

  it('should append a timestamp query param to a URL', () => {
    const url = 'https://example.com/avatar.png';
    const result = getAvatarImageSrc(url);
    expect(result).toMatch(new RegExp(`${url}\\?t=\\d+`));
  });
});
