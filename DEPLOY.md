# Déploiement — Cloudflare Pages

## 1. Créer le projet

1. Connexion : https://dash.cloudflare.com/ → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
2. Autoriser Cloudflare à accéder au repo `trackflaw/trackflaw.github.io`.
3. Sélectionner la branche `main` (production) et la branche `dev` (preview deployments automatiques).

## 2. Build settings

| Champ | Valeur |
|---|---|
| Framework preset | **Astro** |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | (laisser vide) |
| Node version | `22` (variable d'env `NODE_VERSION=22`) |

Cloudflare détecte automatiquement Astro et installe les dépendances avec `npm install`.

## 3. Variables d'environnement

Aucune obligatoire pour la V1. Si plus tard tu ajoutes Plausible, Sentry, etc, les configurer dans **Settings → Environment variables**.

## 4. Domaine custom

1. **Custom domains** → ajouter `trackflaw.com` et `www.trackflaw.com`.
2. Si le DNS est déjà géré par Cloudflare, l'opération est automatique.
3. Sinon, suivre les instructions DNS affichées (ajout d'un CNAME vers `<projet>.pages.dev`).
4. **Supprimer** le fichier `public/CNAME` une fois la migration confirmée — il n'est utile que pour GitHub Pages.

## 5. Headers et redirects

Déjà configurés via :

- **`public/_headers`** — sécurité (HSTS, X-Frame-Options, etc.) et caching agressif sur les assets immutables (`/_astro/*`, `/assets/videos/*`).
- **`public/_redirects`** — redirections 301 (slash final → version sans slash, etc.).

Cloudflare Pages les lit automatiquement à la racine du `dist/`.

## 6. Vérifications post-déploiement

```bash
# Build local
npm run build && npm run preview
# Ouvre http://localhost:4321

# Headers en prod
curl -I https://trackflaw.com
# Vérifier :
# - cf-ray présent
# - strict-transport-security
# - x-content-type-options: nosniff
```

Lighthouse cible :
- Performance ≥ 95
- Best Practices ≥ 95
- Accessibility ≥ 95
- SEO 100

## 7. Rollback

**Cloudflare dashboard → Deployments → ⋯ → Rollback to this deployment**.
Bascule en < 5 secondes, sans rebuild.

## 8. Preview deployments

Chaque PR ouverte sur GitHub déclenche un build dans un environnement isolé avec une URL `https://<hash>.<projet>.pages.dev`. Pratique pour valider visuellement avant merge.

## 9. Migration DNS depuis GitHub Pages

Étapes pour basculer sans coupure :

1. Déployer sur Cloudflare Pages avec un domaine `trackflaw.pages.dev` → vérifier le rendu.
2. Ajouter `trackflaw.com` comme custom domain dans Cloudflare Pages mais **garder le CNAME GitHub Pages actif** quelques minutes.
3. Mettre à jour le DNS (CNAME `trackflaw.com` → `<projet>.pages.dev`) une fois validé.
4. Vérifier la propagation : `dig trackflaw.com CNAME +short`.
5. Une fois trafic sur Cloudflare, désactiver GitHub Pages dans les settings du repo.
