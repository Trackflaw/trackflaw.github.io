/**
 * Access to the LinkedIn posts stored in `src/data/linkedin.json`.
 *
 * That file is refreshed by `scripts/fetch-linkedin.mjs`, run on a schedule
 * by CI and committed to the repo. Nothing here touches the network: the
 * site reads local data only, at build time.
 */

import data from "../data/linkedin.json";

export interface LinkedInImage {
  width: number;
  height: number;
}

export interface LinkedInPostData {
  id: string;
  url: string;
  /** ISO 8601, derived from the timestamp encoded in the activity ID. */
  publishedAt: string;
  text: string;
  /** Dimensions only, used to size the embed. The image itself is rendered by LinkedIn. */
  image: LinkedInImage | null;
}

/** Newest first, as written by the refresh script. */
export const linkedInPosts = data.posts as LinkedInPostData[];

export const latestLinkedInPost = (): LinkedInPostData | null =>
  linkedInPosts[0] ?? null;

export const buildLinkedInEmbedUrl = (activityId: string): string =>
  `https://www.linkedin.com/embed/feed/update/urn:li:activity:${activityId}`;

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Paris",
});

export const formatLinkedInDate = (iso: string): string =>
  dateFormatter.format(new Date(iso));

/**
 * Estimates how tall the embed must be for the whole post to be visible.
 *
 * A cross-origin iframe cannot report its content height and LinkedIn sends
 * no resize message, so the height has to be decided up front. We derive it
 * from the post data we already store, and deliberately round up: a bit of
 * empty space at the bottom is far less annoying than an article cut in half
 * behind an inner scrollbar.
 *
 * `contentWidth` is the width the iframe will actually occupy, which is why
 * the caller computes one value per breakpoint: a narrower iframe wraps the
 * same text into more lines and therefore needs more height.
 */
export function estimateEmbedHeight(
  post: LinkedInPostData,
  contentWidth: number,
): number {
  // Approximations for the embed's own layout: ~15px body text, ~1.4
  // line-height, and a fixed chrome made of the author header plus the
  // reactions bar. They are not measured values, so they are chosen on the
  // high side. If a post ever shows an inner scrollbar, raise CHROME first.
  const AVERAGE_CHAR_WIDTH = 7.6;
  const LINE_HEIGHT = 21;
  const PARAGRAPH_GAP = 9;
  const CHROME = 300;
  const HORIZONTAL_PADDING = 48;

  const textWidth = Math.max(240, contentWidth - HORIZONTAL_PADDING);
  const charsPerLine = Math.floor(textWidth / AVERAGE_CHAR_WIDTH);

  const paragraphs = post.text.split("\n").filter((p) => p.trim() !== "");
  const lines = paragraphs.reduce(
    (total, p) => total + Math.max(1, Math.ceil(p.length / charsPerLine)),
    0,
  );

  let height = CHROME + lines * LINE_HEIGHT + paragraphs.length * PARAGRAPH_GAP;

  if (post.image) {
    height += Math.round(textWidth * (post.image.height / post.image.width));
  }

  // The floor is what a short post actually gets, since its own estimate
  // lands below it. The ceiling keeps a very long one from pushing the rest
  // of the page far below the fold.
  return Math.min(1800, Math.max(720, Math.round(height)));
}
