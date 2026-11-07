# Milad Mohammadi — personal research website

A custom static website for research, PhD opportunities, projects, writing, and an interactive academic CV. The design uses Source Sans 3, a narrow reading column, a clear hierarchy of headings and publication metadata, and restrained forest-green links, with automatic light and dark appearance.

The CV has its own wider layout, with a timeline that animates into thematic chapters. Readers can start with **Key moments**, switch to the **Complete CV**, and expand individual entries for context, conceptual evidence figures, media, and links to supporting work. Search and filters help locate specific experience; an expandable skills appendix keeps technical detail available without overwhelming the overview. CV figures are defined in `src/cv-visuals.js`.

The homepage has a wider editorial layout with a framed portrait, a CV download beneath the photo, PhD availability in the introduction, and two illustrated research features. Contact and profile icons sit in the footer. The layout adapts to small screens; articles retain their narrow reading column and the CV becomes a single-column timeline. Homepage research illustrations are inline SVGs in `featuredResearch()` in `src/components.js`.

The **Blog** at `/blog/` is a simple list of titles, short notes, and writing dates. Posts have a narrow reading layout and a table of contents generated from their section headings. It is a place for ideas across subjects, including topics beyond AI and technology. The former `/projects/` and `/ideas/` indexes redirect to the Blog; individual project pages remain available through CV links.

Every route is generated as a complete HTML page for GitHub Pages. There is no CMS, server application, database, or analytics service. The reading font is self-hosted under the SIL Open Font License; the visitor's appearance preference is stored only in their browser.

## Run locally

Requires **Node.js 20 or newer** and npm.

```sh
npm ci
npm run dev
```

Open [localhost:4321](http://localhost:4321). Changes to `src/`, `content/`, and `public/` rebuild the site; refresh the browser to see them.

```sh
npm run build   # Generate the static site in dist/
npm run preview # Build and serve without watching source changes
npm run check   # Run the repository's static checks
npm test        # Run the Playwright browser tests
```

Local browser tests use installed Google Chrome by default. In environments without Chrome, install Playwright's browser and use the CI configuration:

```sh
npx playwright install chromium
CI=1 npm test
```

## Where to edit

| File or folder | Purpose |
| --- | --- |
| `src/config.js` | Site identity, contact links, PhD availability, canonical origin, review date |
| `src/data/profile.json` | Education, research, work, teaching, projects, skills, and research positioning |
| `src/pages.js` | Home, PhD, collection pages, article layout, and selected results charts |
| `src/components.js` | Shared HTML layout, navigation, footer, formatting, and conceptual diagrams |
| `src/cv.js` | CV entries, timeline and theme chapters, Key moments selection, evidence links, and skills appendix |
| `src/cv-client.js` | Animated view changes, Key moments/Complete CV controls, search, filtering, and expansion |
| `src/cv.css` | CV-specific timeline, thematic chapters, responsive layout, and visual styling |
| `src/cv-visuals.js` | Conceptual evidence figures for research, engineering, and teaching entries |
| `src/site.js` | Appearance controls, mobile navigation, collection filters, article navigation |
| `src/site.css` | Light/dark palette, typography, responsive layout, motion, print styles |
| `content/research/` | Research overviews and publication details in Markdown |
| `content/projects/` | Project and teaching-resource write-ups linked from the CV |
| `content/blog/` | Blog posts in Markdown, each with a title, short description, and writing date |
| `public/` | Images, licensed self-hosted fonts, downloadable CV, and other copied assets |
| `scripts/build.mjs` | Static generation, feeds, sitemap, and legacy redirects |

Font attribution and redistribution terms are in `public/fonts/source-sans-3-OFL.txt`; the normal and italic Latin files are hosted locally. The site makes no font requests to Google or other third parties.

See **[Authoring content](docs/AUTHORING.md)** for Markdown templates, images, diagrams, and updating the CV.

The Blog includes **“A place for unfinished thoughts”** (`content/blog/a-place-for-unfinished-thoughts.md`), a placeholder for reviewing the layout. Edit or remove it before publishing your own writing. Its `sample: true` frontmatter adds a small **Sample post** label inside the article, while the index stays minimal. The old `content/ideas/` folder is no longer built. Research overviews link to their primary sources and distinguish published papers from preprints.

## GitHub Pages

The default configuration targets the root user site, `mohammadi-milad.github.io`. For a project repository hosted below `/repository-name/`, build with:

```sh
BASE_PATH=/repository-name npm run build
```

Use that same `BASE_PATH` when running the local preview. Update `site.origin` in `src/config.js` if the domain changes; keep the repository prefix in `BASE_PATH`, not in the origin.

The deployment workflow is `.github/workflows/pages.yml`. When ready to publish, push the reviewed source to GitHub and select **Settings → Pages → Source → GitHub Actions**. For a project site, set `BASE_PATH` in the workflow's build environment as well. The workflow uploads `dist/`; the generated `.nojekyll` disables Jekyll processing.

This rewrite has been prepared locally. No push or deployment is part of the local build.
