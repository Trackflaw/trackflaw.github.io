# trackflaw.com

Site vitrine de Trackflaw, Astro 5 + Tailwind 4, design glassmorphic.

## Stack

- **Astro 5**, generation statique, zéro JS par défaut
- **Tailwind CSS 4**, design system via `@theme` tokens
- **TypeScript strict**
- **`@astrojs/sitemap`**, `/sitemap-index.xml` généré au build

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # output → dist/
npm run preview  # preview du build
npm run check    # type-check Astro + TS
```

## Structure

```
src/
├── components/   # UI (Navbar, Footer, GlassCard, Button, Accordion, …)
├── data/         # Contenu typé (team, faq, services)
├── layouts/      # Layout.astro (head global, GTM, SEO, OG)
├── pages/        # Routes file-based (1 fichier = 1 page)
├── scripts/      # Vanilla TS (reveal IntersectionObserver, nav, accordion)
└── styles/       # global.css (tokens Tailwind, utilities glass/glow/reveal)
public/           # Assets servis tels quels
├── _headers      # Headers HTTP Cloudflare Pages
├── _redirects    # Redirections Cloudflare Pages
├── assets/videos # Vidéos hero & présentation
├── images/       # Photos équipe, news, partenaires
└── logos/        # Identité de marque
```

## Pages

| Route | Source |
|---|---|
| `/` | `src/pages/index.astro` |
| `/services` | `src/pages/services/index.astro` |
| `/méthodologie` | `src/pages/méthodologie/index.astro` |
| `/valeurs` | `src/pages/valeurs/index.astro` |
| `/commande` | `src/pages/commande/index.astro` |
| `/mentions-légales` | `src/pages/mentions-légales/index.astro` |
| `/1337` | `src/pages/1337/index.astro` |
| `/404` | `src/pages/404.astro` |

## Design tokens

Voir `src/styles/global.css` (`@theme` block) :
- Brand : `--color-brand: #17b2ff`
- Background : gradient radial sombre via `--color-bg` / `--color-bg-2`
- Glass : `--color-surface`, `--color-border`, classes `.glass`, `.glass-strong`, `.glass-hover`
- Glow : `--shadow-glow*`, classe `.glow`, `.glow-sm`, `.glow-lg`
- Fonts : Open Sans (corps), Roboto Condensed (titres, classe `.font-display`)

## Déploiement

Voir [`DEPLOY.md`](./DEPLOY.md). Cible : **Cloudflare Pages**.
