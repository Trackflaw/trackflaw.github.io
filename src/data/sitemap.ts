/**
 * Pages listed in `/sitemap.xml` (see `src/pages/sitemap.xml.ts`).
 *
 * Only indexable pages belong here: nothing rendered with `noindex`, nothing
 * disallowed in `public/robots.txt`, no error page. Any new public page must
 * be added to this list to be picked up by search engines.
 *
 * `sources` are the repository files whose last commit dates the page's
 * content: the page itself and the data it renders. Layout, components and
 * styles are deliberately left out, a design tweak is not a content update.
 */
export interface SitemapPage {
  /** Route path without trailing slash, the site redirects it away. */
  path: string;
  /** Repository paths, relative to the project root. */
  sources: string[];
}

export const sitemapPages: SitemapPage[] = [
  {
    path: "/",
    sources: [
      "src/pages/index.astro",
      "src/data/faq.ts",
      "src/data/social.ts",
      "src/data/team.ts",
      "src/data/linkedin.json",
    ],
  },
  {
    path: "/services",
    sources: ["src/pages/services/index.astro", "src/data/services.ts"],
  },
  {
    path: "/méthodologie",
    sources: ["src/pages/méthodologie/index.astro"],
  },
  {
    path: "/valeurs",
    sources: ["src/pages/valeurs/index.astro"],
  },
  {
    path: "/commande",
    sources: ["src/pages/commande/index.astro"],
  },
];
