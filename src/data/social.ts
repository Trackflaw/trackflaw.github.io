/**
 * Trackflaw social presence — central source of truth for the website.
 * Update `linkedinFeaturedPost` whenever a new post should be highlighted
 * on the homepage (no other code change required).
 */

export const socialHandles = {
  youtube: "@trackflaw",
  instagram: "@trackflaw",
  tiktok: "@trackflaw",
  linkedin: "trackflaw",
} as const;

export const socialUrls = {
  youtube: "https://www.youtube.com/@trackflaw",
  youtubeSubscribe: "https://www.youtube.com/@trackflaw?sub_confirmation=1",
  instagram: "https://www.instagram.com/trackflaw/",
  tiktok: "https://www.tiktok.com/@trackflaw?lang=fr",
  linkedin: "https://www.linkedin.com/company/trackflaw",
} as const;

export const youtubeChannelId = "UC7lCQTgViJTA-J6aqY9YxwA";

/**
 * Latest LinkedIn post is fetched dynamically from the Trackflaw proxy at
 * https://linkedin.trackflaw.com/ — see `src/utils/linkedin.ts`.
 * No manual update needed when a new post is published.
 */
