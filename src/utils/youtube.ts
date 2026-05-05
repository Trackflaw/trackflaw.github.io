export interface YouTubeVideo {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
}

const decodeXmlEntities = (s: string): string =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");

/**
 * Detects whether a YouTube video ID is a Short.
 *
 * Method: hit https://www.youtube.com/shorts/<id> with a manual redirect.
 *  - Shorts return HTTP 200 (the Short page renders).
 *  - Regular videos return HTTP 303 with Location: /watch?v=<id>.
 * The `SOCS=CAI` cookie pre-accepts EU consent so we bypass the
 * consent.youtube.com redirect noise.
 */
export async function isYouTubeShort(id: string): Promise<boolean> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: "HEAD",
      redirect: "manual",
      headers: {
        Cookie: "SOCS=CAI",
        "User-Agent": "Mozilla/5.0 trackflaw-site-build",
      },
    });
    return res.status === 200;
  } catch {
    // On error, conservatively assume not a Short so we don't drop content.
    return false;
  }
}

/**
 * Fetches the latest videos from a YouTube channel using the public RSS feed.
 * No API key required. Returns an empty array on any error so the build
 * never breaks because of network issues.
 *
 * `includeShorts` defaults to false: each candidate is probed and Shorts
 * are filtered out. We pull a larger pool from the feed (15 entries) so
 * we can still return `count` long-form videos when Shorts are recent.
 */
export async function fetchLatestYouTubeVideos(
  channelId: string,
  count = 4,
  options: { includeShorts?: boolean; pool?: number } = {},
): Promise<YouTubeVideo[]> {
  const { includeShorts = false, pool = 15 } = options;
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  try {
    const res = await fetch(feedUrl, {
      headers: { "User-Agent": "trackflaw-site-build" },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const entryRegex =
      /<entry>[\s\S]*?<yt:videoId>([^<]+)<\/yt:videoId>[\s\S]*?<title>([\s\S]*?)<\/title>[\s\S]*?<published>([^<]+)<\/published>[\s\S]*?<\/entry>/g;

    const candidates: YouTubeVideo[] = [];
    let match: RegExpExecArray | null;
    while (
      (match = entryRegex.exec(xml)) !== null &&
      candidates.length < pool
    ) {
      const id = match[1];
      candidates.push({
        id,
        title: decodeXmlEntities(match[2].trim()),
        publishedAt: match[3],
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      });
    }

    if (includeShorts) return candidates.slice(0, count);

    const shortFlags = await Promise.all(
      candidates.map((v) => isYouTubeShort(v.id)),
    );
    return candidates.filter((_, i) => !shortFlags[i]).slice(0, count);
  } catch {
    return [];
  }
}
