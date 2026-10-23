# Sarath K C — Engineering Portfolio

Astro (static site) + Sanity (content editing) + GitHub + Netlify.
Palette: charcoal `#090907`, earth brown `#6c5636`, tan `#b59467` for small text (brown alone fails contrast on charcoal).

## How the pieces connect

```
 You (phone/laptop) ──► Sanity Studio (hosted, login required)
                              │ Publish
                              ▼
                        Sanity dataset ──webhook──► Netlify build hook
                                                         │
 GitHub repo (this code) ──push──► Netlify build: `npm run build`
                                     │ fetches published content from Sanity at build time
                                     ▼
                              static site (dist/)
```

- **Content** (projects, skills, experience, research, résumé, contact links, images) lives in Sanity. Editing never touches code.
- **Code** lives in GitHub. Netlify rebuilds on every push and on every Sanity publish.
- **Auth:** Sanity's own login (Google/GitHub/email). There is no custom admin login in this repo.
- **Media:** images and the résumé PDF are stored in Sanity's asset CDN.
- **Fallback:** if `SANITY_PROJECT_ID` is not set, the site builds from `src/data/seed/*.json`. If it *is* set and Sanity is unreachable, the build **fails** instead of publishing an empty site (Netlify then keeps serving the last good deploy).

## Repository structure

```
src/lib/content.ts      content loader (Sanity or seed), types, sorting
src/data/seed/*.json    starting content, same shape as the CMS documents
src/pages/              /, /projects/, /projects/<slug>/, /experience/, /skills/, /research/, 404, robots.txt
src/components/         ProjectCard
src/layouts/Base.astro  head/SEO/OG, nav, footer
src/styles/global.css   design tokens and components
studio/                 Sanity Studio (schemas for project, experience, skill, research, siteSettings)
scripts/seed-to-ndjson.mjs   converts seed JSON for one-time import into Sanity
docs/CREDIBILITY-AUDIT.md    what was removed and what you must confirm
netlify.toml, .env.example
```

## Run locally

```bash
npm install
npm run dev        # http://localhost:4321  (uses seed data unless .env sets SANITY_PROJECT_ID)
npm run build      # production build into dist/
npm run preview
```
Do not keep the project on a drive that cannot create symlinks (npm install fails there).

## One-time setup (needs your accounts — I could not do these for you)

1. **GitHub:** create a repo, push this folder. `.env` is git-ignored; never commit secrets.
2. **Sanity:** sign in at sanity.io/manage → create a project (dataset `production`, keep it **public read**; drafts are never exposed without a token). Copy the *project ID* (not secret).
3. **Studio:**
   ```bash
   cd studio && npm install
   export SANITY_STUDIO_PROJECT_ID=<your id>     # Windows PowerShell: $env:SANITY_STUDIO_PROJECT_ID="<your id>"
   npx sanity login
   npx sanity deploy         # gives you https://<name>.sanity.studio, login-protected
   ```
4. **Import starting content (once):**
   ```bash
   cd ..                       # repo root
   npm run seed:ndjson
   cd studio && npx sanity dataset import ../seed.ndjson production
   ```
   The three unconfirmed projects import as **drafts** (hidden until published).
5. **Netlify:** Site settings → Environment variables: `SANITY_PROJECT_ID`, `SANITY_DATASET=production`, `SITE_URL=<final URL>`. Build command `npm run build`, publish `dist` (also in `netlify.toml`).
6. **Auto-rebuild on publish:** Netlify → Site settings → Build hooks → create one, copy URL. Sanity manage → API → Webhooks → new: URL = the hook, trigger on create/update/delete, dataset `production`.
7. **Team access:** Sanity manage → Members (invite only yourself unless you want others).

## Everyday use (phone or laptop)

Open your `*.sanity.studio` URL and sign in.
- **Add a project:** Projects → Create. Fill title, slug, status, summary, tools, categories; add case-study sections and links; **Publish**. Site updates in ~1–2 minutes. Until you publish, it stays a draft.
- **Unpublish:** document menu (⋯) → Unpublish.
- **Feature a project:** tick *Featured* (first three show on the home page).
- **Diagram/screenshot:** upload in the *Architecture diagram* field and add alt text.
- **Skills:** Skills → edit level (*Used in project / Working knowledge / Currently learning*), link related projects.
- **Experience / research:** their own lists. Do not enter confidential employer details.
- **Résumé:** Site settings → upload PDF. The Download button appears only when a file exists.
- **Contact/links/intro:** Site settings.
- **Preview drafts locally:** create a Viewer token in Sanity, set `SANITY_PREVIEW=true` and `SANITY_READ_TOKEN=<token>` in `.env`, run `npm run dev`. (Token stays in `.env`, never in the repo.)

Case-study body text: blank line = new paragraph; a line starting with `- ` = bullet.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Publish in Sanity, site unchanged | Netlify → Deploys: did the webhook trigger a build? Check the webhook log in Sanity manage. Trigger the build hook manually. |
| Netlify build fails | Open the deploy log. `ECONNRESET`/401 from Sanity = wrong `SANITY_PROJECT_ID`/dataset. The previous deploy stays live. |
| Project missing | It is a draft, or has no slug. |
| Roll back | Netlify → Deploys → pick an earlier deploy → *Publish deploy*. |

## Backup and recovery
- Content: `cd studio && npx sanity dataset export production backup.tar.gz` monthly; keep a copy outside the repo.
- Code: GitHub. The seed JSON is also a readable copy of your starting content.
- The previous single-file site is preserved as `vlsi-portfolio/index.html`; it is still what your Netlify URL serves until you deploy this one. Deploying this repo replaces it; roll back from Netlify's Deploys list.

## Tested vs not tested
Tested here: production build; all 12 routes; 132 internal links (0 broken); sitemap, robots.txt, canonical URLs; project search, category and status filters, sort and empty-result state (simulated DOM); résumé button appears/disappears with the file; site builds with all content empty; build fails loudly when Sanity is configured but unreachable.
**Not tested (needs your accounts or a real browser):** the live Sanity fetch, Studio login/publish, webhook → Netlify rebuild, Studio schema load (syntax-checked only), mobile menu on a real device, keyboard walkthrough, Lighthouse/Core Web Vitals, deployment to Netlify.

## Known limitations
- No contact form (links only) — a form needs a backend and spam protection; add Netlify Forms later if wanted.
- No light/dark toggle, no Open Graph image yet (add a 1200×630 PNG and an `og:image` tag in `Base.astro`).
- Dark charcoal theme only; body text is system fonts (no external requests).
- Case-study sections are plain text; diagrams are uploaded images, not generated.
