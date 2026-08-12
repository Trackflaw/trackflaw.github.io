#!/usr/bin/env node
/**
 * Refreshes `src/data/linkedin.json` from the public LinkedIn company page.
 *
 * Designed to run in CI on a schedule. It is deliberately fail-soft: on any
 * error (LinkedIn bot wall, markup change, network) it exits 0 without
 * touching the data file, so the site keeps serving the last known good
 * posts instead of breaking. Nothing here runs at build or request time.
 *
 * Usage: node scripts/fetch-linkedin.mjs [--dry-run]
 */

import { writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA_FILE = path.join(ROOT, "src/data/linkedin.json");

const COMPANY = "trackflaw";
const PAGE_URL = `https://fr.linkedin.com/company/${COMPANY}`;
const KEEP = 3;
const DRY_RUN = process.argv.includes("--dry-run");

/**
 * LinkedIn answers HTTP 999 to anything that does not look like a browser,
 * so a full set of navigation headers is required, not just a User-Agent.
 */
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.71 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
  "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

const log = (...a) => console.log("[linkedin]", ...a);

/** Bails out without writing anything, so the committed data survives. */
const giveUp = (reason) => {
  log(`abandon : ${reason}. Les donnees existantes sont conservees.`);
  process.exit(0);
};

const decodeEntities = (s) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");

const stripTags = (s) => s.replace(/<[^>]+>/g, "");

/**
 * A LinkedIn activity ID carries its creation time in its high bits:
 * the first 41 bits are the epoch in milliseconds.
 */
const publishedAtOf = (id) =>
  new Date(Number(BigInt(id) >> 22n)).toISOString();

/**
 * Each post card exposes its URN in the "report this post" menu, which sits
 * just before the post body. Splitting on that URN gives a reliable
 * id-to-content pairing without needing a DOM parser.
 */
function parsePosts(html) {
  const chunks = html.split(/data-semaphore-content-urn="urn:li:activity:(\d+)"/);
  const posts = [];
  const seen = new Set();

  for (let i = 1; i < chunks.length; i += 2) {
    const id = chunks[i];
    const body = chunks[i + 1];
    if (seen.has(id)) continue;
    seen.add(id);

    const text = body.match(
      /data-test-id="main-feed-activity-card__commentary"[^>]*>([\s\S]*?)<\/p>/,
    );
    if (!text) continue;

    // Only `feedshare` assets are post images; anything else is a page avatar.
    const image = body.match(
      /data-delayed-url="(https:\/\/media\.licdn\.com\/[^"]*feedshare[^"]*)"/,
    );

    posts.push({
      id,
      url: `https://www.linkedin.com/feed/update/urn:li:activity:${id}`,
      publishedAt: publishedAtOf(id),
      text: decodeEntities(stripTags(text[1])).trim(),
      imageSource: image ? decodeEntities(image[1]) : null,
    });
  }

  // IDs grow monotonically with time, so the largest is the newest post.
  return posts.sort((a, b) => (BigInt(b.id) > BigInt(a.id) ? 1 : -1));
}

/**
 * Reads intrinsic JPEG dimensions by walking the marker segments to the
 * frame header. Those dimensions go into the data file so the card can
 * reserve the exact space and never shift the layout while loading.
 */
function jpegSize(buf) {
  let i = 2;
  while (i < buf.length - 9) {
    if (buf[i] !== 0xff) {
      i += 1;
      continue;
    }
    const marker = buf[i + 1];
    // Start-of-frame markers, excluding the ones that carry no dimensions.
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
    }
    if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) {
      i += 2;
      continue;
    }
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return null;
}

/**
 * Reads a post image's dimensions without keeping the file. The image itself
 * is rendered by the LinkedIn embed, we only need its aspect ratio to know
 * how tall the iframe has to be. Images are small, so a full download is
 * simpler than a ranged request and runs at most three times per job.
 */
async function probeImage(post) {
  if (!post.imageSource) return null;
  try {
    const res = await fetch(post.imageSource, {
      headers: { "User-Agent": BROWSER_HEADERS["User-Agent"] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const size = jpegSize(Buffer.from(await res.arrayBuffer()));
    if (!size) throw new Error("dimensions illisibles");
    return size;
  } catch (err) {
    // Falling back to no image only makes the height estimate slightly small.
    log(`dimensions d'image ignorees pour ${post.id} : ${err.message}`);
    return null;
  }
}

async function main() {
  let html;
  try {
    const res = await fetch(PAGE_URL, { headers: BROWSER_HEADERS });
    if (res.status === 999) giveUp("LinkedIn a repondu 999 (mur anti-bot)");
    if (!res.ok) giveUp(`LinkedIn a repondu HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    giveUp(`requete impossible : ${err.message}`);
  }

  const parsed = parsePosts(html);
  if (parsed.length === 0) {
    giveUp("aucun post trouve, le balisage LinkedIn a probablement change");
  }
  log(`${parsed.length} posts lus, le plus recent date du ${parsed[0].publishedAt.slice(0, 10)}`);

  const kept = parsed.slice(0, KEEP);

  let previous = null;
  try {
    previous = JSON.parse(await readFile(DATA_FILE, "utf8"));
  } catch {
    // First run, nothing to compare against.
  }

  // Never move backwards: a partial page must not overwrite a newer post.
  if (previous?.posts?.[0] && BigInt(previous.posts[0].id) > BigInt(kept[0].id)) {
    giveUp(
      `le post le plus recent en ligne (${kept[0].id}) est plus ancien que celui deja enregistre (${previous.posts[0].id})`,
    );
  }

  const posts = [];
  for (const post of kept) {
    const image = await probeImage(post);
    const { imageSource, ...rest } = post;
    posts.push({ ...rest, image });
  }

  const next = { source: PAGE_URL, posts };

  // `fetchedAt` is intentionally absent: it would change on every run and
  // produce an empty commit each time nothing was actually published.
  if (JSON.stringify(previous) === JSON.stringify(next)) {
    log("aucun changement.");
    return;
  }

  if (DRY_RUN) {
    log("dry-run, resultat :");
    console.log(JSON.stringify(next, null, 2));
    return;
  }

  await writeFile(DATA_FILE, `${JSON.stringify(next, null, 2)}\n`, "utf8");
  log(`${DATA_FILE} mis a jour.`);
}

main().catch((err) => giveUp(`erreur inattendue : ${err.message}`));
