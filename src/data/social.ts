/**
 * Trackflaw social presence, central source of truth for the website.
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
 * The latest LinkedIn posts live in `src/data/linkedin.json`, refreshed on a
 * schedule by `.github/workflows/linkedin.yml` and committed to the repo.
 * Read them through `src/utils/linkedin.ts`. No network call at build or
 * request time, and the file can be edited by hand if CI ever gets blocked.
 */
