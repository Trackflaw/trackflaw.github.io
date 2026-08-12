# AGENT.md

Guide de travail pour un agent IA sur ce dépôt. Objectif : pouvoir intervenir sans relire
l'intégralité du code à chaque session.

> Ce dépôt est **public**. Aucun secret, identifiant, jeton, IP interne ou détail
> d'infrastructure privée ne doit être ajouté ici ni committé ailleurs dans le projet.

## Contexte

Site vitrine de Trackflaw (société de sécurité offensive, tests d'intrusion), publié sur
https://trackflaw.com. Site **entièrement statique**, contenu en français.

## Commandes

```bash
npm install
npm run dev      # http://localhost:4321, hot reload (ajouter -- --host pour exposer sur le LAN)
npm run build    # génère dist/
npm run preview  # sert le build
npm run check    # astro check + TypeScript
```

Avant de proposer une modification : `npm run check` puis `npm run build` doivent passer
sans erreur. Le build effectue des appels réseau (voir « Données récupérées au build »),
il faut donc une connexion.

## Stack

- **Astro 5** en sortie statique, zéro framework UI, zéro JS par défaut
- **Tailwind CSS 4** via le plugin Vite `@tailwindcss/vite`, pas de `tailwind.config.js` :
  tout le design system vit dans le bloc `@theme` de `src/styles/global.css`
- **TypeScript strict**
- `@astrojs/sitemap` génère `/sitemap-index.xml`
- Aucune dépendance runtime côté client, uniquement du TS vanilla

## Architecture

```
src/
├── components/   # composants .astro, tous sans état, props typées via `interface Props`
├── data/         # contenu typé et exporté (services, faq, team, social)
├── layouts/      # Layout.astro : head, SEO/OG, analytics, Navbar + slot + Footer
├── pages/        # routing par fichier
├── scripts/      # TS vanilla importé globalement par Layout.astro
├── styles/       # global.css : @theme, @layer base, @layer utilities
└── utils/        # fetch au build (youtube.ts, linkedin.ts)
public/           # servi tel quel, dont _headers et _redirects
```

### Pages

| Route | Fichier |
|---|---|
| `/` | `src/pages/index.astro` (page longue, la majorité du contenu) |
| `/services` | `src/pages/services/index.astro` |
| `/méthodologie` | `src/pages/méthodologie/index.astro` |
| `/valeurs` | `src/pages/valeurs/index.astro` |
| `/commande` | `src/pages/commande/index.astro` |
| `/mentions-légales` | `src/pages/mentions-légales/index.astro` |
| `/1337` | `src/pages/1337/index.astro` (easter egg) |
| `/404` | `src/pages/404.astro` |

Deux routes contiennent des **accents dans leur URL** (`/méthodologie`, `/mentions-légales`).
C'est volontaire et référencé, ne pas « corriger ». Attention à l'encodage en shell et dans
les liens.

### Composants et leurs props

| Composant | Props principales |
|---|---|
| `Layout` | `title`, `description`, `image`, `canonical`, `noindex` |
| `Section` | `id`, `size` (`sm`\|`md`\|`lg`\|`xl`), `containerSize` |
| `Container` | `size` |
| `SectionTitle` | `eyebrow`, `title` (requis), `subtitle`, `align` |
| `Button` | `href`, `variant` (`primary`\|`ghost`\|`outline`), `size`, `type` |
| `GlassCard` | `hover`, `strong`, `as` (`div`\|`article`\|`li`) |
| `Reveal` | `delay` (0 à 4), `as` |
| `Meter` | `label`, `level` (`low`\|`medium`\|`high`\|`very-high`), `value`, `icon` |
| `Accordion` | `items: { question, answer }[]` (réponses en HTML brut) |
| `Carousel` | `id`, `slides: CarouselSlide[]`, `autoplay`, `ariaLabel` |
| `TeamCard` | `member: Member`, `delay` |
| `LinkedInPost` | aucune, autonome |
| `SocialHub` | aucune, liste des plateformes en dur dans le composant |

### Scripts globaux

Importés une seule fois, en bas de `Layout.astro`. Ils ciblent des attributs `data-*`,
jamais des classes :

| Fichier | Sélecteur | Rôle |
|---|---|---|
| `reveal.ts` | `.reveal` | IntersectionObserver, ajoute `.is-visible` |
| `nav.ts` | `[data-nav]`, `[data-nav-toggle]` | état scrollé, menu mobile |
| `accordion.ts` | `[data-accordion]` | FAQ, ouverture exclusive |
| `spotlight.ts` | `[data-spotlight]` | écrit `--mx` / `--my` au survol |
| `carousel.ts` | `[data-carousel-*]` | slider, swipe tactile |

## Design system

Tokens dans `@theme` (`src/styles/global.css`), utilisables directement en classes Tailwind
(`text-brand`, `bg-bg-2`, `text-fg-muted`, etc.) :

- Marque : `--color-brand: #17b2ff`, plus `brand-soft`, `brand-deep`, `brand-neon`,
  `--color-accent` (violet)
- Fonds sombres : `--color-bg`, `--color-bg-2`, `--color-bg-3`
- Surfaces verre : `--color-surface`, `--color-surface-hover`, `--color-border`,
  `--color-border-strong`
- Texte : `--color-fg`, `--color-fg-muted`, `--color-fg-dim`
- Ombres : `--shadow-glow-sm`, `--shadow-glow`, `--shadow-glow-lg`, `--shadow-neon`

Utilitaires maison (`@layer utilities`) à réutiliser plutôt que de réinventer :
`.glass`, `.glass-strong`, `.glass-hover`, `.glow`, `.glow-sm`, `.glow-lg`, `.neon-ring`,
`.text-gradient`, `.text-gradient-neon`, `.text-soft-gradient`, `.heading-soft`,
`.neon-underline`, `.btn-electric`, `.spotlight`, `.spotlight-card`, `.bg-noise`, `.grain`,
`.font-display`, `.reveal` + `.reveal-delay-1..4`, `.animate-glow`, `.animate-scroll-hint`,
`.animate-shimmer`.

Thème sombre uniquement (`color-scheme: dark`), pas de variante claire. Les animations sont
neutralisées sous `prefers-reduced-motion`, conserver ce comportement.

Police réelle : **Inter**, chargée depuis Google Fonts dans `Layout.astro`, pour
`--font-sans` comme pour `--font-display`.

## Données récupérées au build

Deux `fetch` s'exécutent pendant `astro build` et sont figés dans le HTML généré. Les deux
échouent silencieusement (retour vide ou `null`) pour ne jamais casser le build.

**YouTube** (`src/utils/youtube.ts`) : flux RSS public de la chaîne, sans clé d'API.
Les Shorts sont détectés puis filtrés en sondant `youtube.com/shorts/<id>`. L'ID de chaîne
est dans `src/data/social.ts`. Appelé depuis `index.astro`.

**LinkedIn** : aucun appel réseau. Les posts sont **commités dans le dépôt**, voir la
section suivante.

## Publications LinkedIn

Le build ne contacte jamais LinkedIn. L'ID du post à afficher vient d'un fichier versionné,
rafraîchi par une tâche planifiée, et c'est ensuite l'iframe officielle qui affiche le
contenu chez le visiteur.

```
.github/workflows/linkedin.yml   cron 2x/jour + workflow_dispatch
   └─ scripts/fetch-linkedin.mjs (Node, sans dépendance)
        └─ src/data/linkedin.json   3 posts les plus récents
             └─ commit sur main, qui déclenche le déploiement
```

`src/utils/linkedin.ts` expose les types, `latestLinkedInPost()`,
`buildLinkedInEmbedUrl()` et `estimateEmbedHeight()`. `LinkedInPost.astro` rend un en-tête
maison au-dessus de l'iframe `linkedin.com/embed`.

**Hauteur de l'iframe.** Une iframe cross-origin ne peut pas s'auto-dimensionner et LinkedIn
n'envoie aucun message de redimensionnement, donc la hauteur est calculée au build à partir
du texte du post et, s'il y en a une, du ratio de son image. Deux valeurs sont produites, une
par palier de largeur réelle du conteneur (environ 340 px sur mobile, 704 px au-dessus du
palier `md`), et injectées en variables CSS. Elles ne peuvent pas être des classes
Tailwind : le compilateur ne génère que les classes qu'il voit littéralement dans les
sources. Chaque palier utilise la largeur la plus étroite de sa plage, une iframe plus
étroite renvoyant le texte à la ligne plus souvent, donc l'estimation n'est jamais courte.

Trois réglages dans `estimateEmbedHeight` (`src/utils/linkedin.ts`) :
`CHROME` à augmenter si un post affiche une barre de défilement interne, le plancher (720 px)
qui détermine seul la hauteur des posts courts, et le plafond (1800 px) qui borne les très
longs.

Le champ `image` du JSON ne contient **que des dimensions**, pas d'URL : elles servent
uniquement à estimer la hauteur, l'image elle-même est rendue par LinkedIn.

Points de conception à préserver si vous touchez au script :

- **Il est fail-soft.** Toute erreur (mur anti-bot, balisage changé, réseau) provoque une
  sortie en code 0 **sans rien écrire**. Le site continue d'afficher le dernier post connu.
  Ne jamais transformer ces cas en échec bloquant.
- **Il ne recule jamais.** Si le post le plus récent trouvé en ligne est plus ancien que
  celui déjà enregistré, l'écriture est refusée.
- **Les IDs d'activité croissent avec le temps**, le plus grand est donc le plus récent, et
  son horodatage en millisecondes vaut `id >> 22`. C'est ce qui sert à dater les posts sans
  parser de date.
- **LinkedIn répond HTTP 999** à toute requête qui ne ressemble pas à un navigateur, d'où
  le jeu complet d'en-têtes dans le script. Un simple User-Agent ne suffit pas.
- Les dimensions des images sont lues dans le JPEG téléchargé, mais **le fichier n'est pas
  conservé** : seules les dimensions servent, pour estimer la hauteur de l'iframe.

Le fichier `src/data/linkedin.json` **peut être édité à la main** si la tâche planifiée se
fait bloquer durablement. C'est le repli prévu, pas un contournement.

Test local sans rien modifier : `node scripts/fetch-linkedin.mjs --dry-run`.

## Déploiement

Cible actuelle : **Cloudflare Worker servant des assets statiques**, configuré par
`wrangler.toml` (`[assets] directory = "./dist"`, `not_found_handling = "404-page"`,
`html_handling = "drop-trailing-slash"`). La normalisation du slash final est gérée là,
pas dans `public/_redirects`.

`public/_headers` définit les en-têtes de sécurité (HSTS, `X-Content-Type-Options`,
`Referrer-Policy`, `Permissions-Policy`) et un cache **immutable d'un an** sur `/_astro/*`,
`/assets/videos/*`, `/*.css`, `/*.js`. Ne jamais y ajouter un chemin dont le nom n'est pas
versionné par un hash, le contenu deviendrait impossible à mettre à jour.

`DEPLOY.md` décrit encore l'ancienne cible Cloudflare **Pages** et une migration depuis
GitHub Pages. Historique, à lire avec prudence.

## Pièges connus

- `README.md` annonce Open Sans et Roboto Condensed, le code utilise **Inter**. Le code fait foi.
- `dist/`, `.astro/`, `node_modules/` et `.idea/` sont ignorés par git, ne rien y éditer.
- Les icônes SVG sont stockées en chaînes de `<path>` dans les fichiers `data/` et injectées
  via `set:html`. Ce contenu est écrit en dur dans le dépôt, ne jamais y passer une valeur
  provenant de l'extérieur.
- Certaines réponses de `data/faq.ts` contiennent du HTML brut (`<br>`, `<a>`), rendu tel quel.
- Analytics : `gtag` est inséré en `is:inline` dans `Layout.astro`.
- Les images d'équipe suivent le nom du membre et peuvent porter des accents
  (ex. `public/images/ménad.png`).

## Règles de rédaction

- Tout le contenu visible est en **français**, vouvoiement.
- **Pas de tiret cadratin** (em dash, U+2014) dans les textes ni dans les commentaires.
  Utiliser une virgule, un deux-points ou des parenthèses. Vérification, en évitant
  volontairement le caractère lui-même pour ne pas polluer le résultat :
  `grep -rnIP '\x{2014}' src public *.md *.mjs *.toml`
- Les commentaires de code sont en anglais, le contenu affiché en français.

## Conventions

- Un composant par fichier, props déclarées dans une `interface Props` puis déstructurées
  avec valeurs par défaut.
- Le contenu éditorial va dans `src/data/`, typé et exporté, jamais en dur dans une page,
  sauf pour un bloc réellement propre à une seule page.
- Le JS client passe par `src/scripts/`, ciblé sur des attributs `data-*`, et se dégrade
  proprement quand l'élément est absent.
- Pas d'ajout de dépendance runtime côté client sans raison forte, la valeur du site est sa
  légèreté.
