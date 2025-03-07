// Get image src for avatar
// If URL is in base64, we can load directly
// If URL is a link, we need to invalidate cache and load the most recent image
export function getAvatarImageSrc(avatarUrl: string) {
    // Check if the URL is not a base64 image
    if (avatarUrl.startsWith('data:image')) {
      return avatarUrl; // Return base64 image directly
    } 
    // Add timestamp to force the database to load latest image (not from cache)
    return `${avatarUrl}?t=${Date.now()}`;
}