import type { APIRoute } from "astro";
import { sitemapPages } from "../data/sitemap";
import { lastCommitDate } from "../utils/git";

/**
 * Single flat sitemap at the conventional `/sitemap.xml` location.
 *
 * Search engines only act on `<loc>` and `<lastmod>`: `<changefreq>` and
 * `<priority>` are ignored by Google and Bing, so they are left out. `lastmod`
 * comes from git and is omitted rather than guessed when history is missing.
 * URLs are absolute, canonical (https, no trailing slash) and percent-encoded
 * by `new URL()`, which matters for the accented routes.
 */
const escapeXml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = ({ site }) => {
  if (!site) {
    throw new Error("`site` must be set in astro.config.mjs to build the sitemap.");
  }

  const entries = sitemapPages.map(({ path, sources }) => {
    const loc = escapeXml(new URL(path, site).href);
    const lastmod = lastCommitDate(sources);
    const lines = [`    <loc>${loc}</loc>`];
    if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
    return `  <url>\n${lines.join("\n")}\n  </url>`;
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
