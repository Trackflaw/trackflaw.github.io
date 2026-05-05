/**
 * Helper around the Trackflaw LinkedIn proxy at https://linkedin.trackflaw.com/.
 * The endpoint returns the activity ID of the most recent company-page post
 * as plain text (e.g. "7451946207041740800"). CORS is open, so the same
 * function works at build time (Node fetch) and at runtime in the browser.
 */

export const LINKEDIN_LATEST_ENDPOINT = "https://linkedin.trackflaw.com/";

export const isValidActivityId = (s: string): boolean => /^\d{15,30}$/.test(s);

export async function fetchLatestLinkedInActivityId(
  init?: RequestInit,
): Promise<string | null> {
  try {
    const res = await fetch(LINKEDIN_LATEST_ENDPOINT, init);
    if (!res.ok) return null;
    const text = (await res.text()).trim();
    return isValidActivityId(text) ? text : null;
  } catch {
    return null;
  }
}

export const buildLinkedInEmbedUrl = (activityId: string): string =>
  `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;

export const buildLinkedInPostUrl = (activityId: string): string =>
  `https://www.linkedin.com/feed/update/urn:li:activity:${activityId}`;
