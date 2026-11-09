# Milad Mohammadi — personal research website

A custom static website for research, PhD opportunities, projects, writing, and an interactive academic CV. The design uses Source Sans 3, a narrow reading column, a clear hierarchy of headings and publication metadata, and restrained forest-green links, with automatic light and dark appearance.

Every page shares the same outer width and responsive margins as the navigation and footer. The CV uses this shared layout. A full-size Curriculum vitae heading, one short paragraph with a compact PDF download box, and four factual highlights lead into the full record, organized by **Theme** by default or by **Timeline**. Theme view begins with an expandable future PhD entry in Education. Timeline view reads newest first: PhD availability, master’s, the national entrance-exam bridge, bachelor’s, and before the bachelor’s. The master’s degree overview leads into year three, year two, and year one; records within each stage also run newest first. Subtle theme labels appear under dates on desktop and beside them on mobile, identifying each timeline record without repeating labels in Theme view. Each category has a distinct muted accent with a lightly tinted fill and border, tuned separately for light and dark appearance. PsyCIDRA appears first within year three as the master’s thesis publication, retaining its actual October 2026 preprint date. The pre-bachelor’s heading has no date subtitle; the school entry retains its own dates. TEDx appears once in the pre-bachelor’s chapter. Secondary Education (SAMPAD), the TEDxKish Youth Innovator Award, and the corrected TEDx Organizer role also appear in their respective themes. The seven thematic chapters—education, publications, awards, research roles, industry, teaching, and volunteering service—retain numbered headings; the final three also have brief introductions. The two research roles carry their master’s thesis context inside their own expanded entries. Text-to-Insight and MedYar are excluded from both CV views; their data and standalone write-ups are retained for future use. Entries stay compact until opened. Expanded publications present the full paper title, author list with Milad’s name emphasized, a brief overview, and his specific contribution. The M.Sc. and B.Sc. entries include English transcript previews that open as large images over the current page; without JavaScript, they expand inline. The B.Sc. translation is marked unofficial, and personal identifiers are hidden in the public images. Grades and other emphasized details retain the body text size. Research roles list the NLP Lab before Computational Cognitive Psychology in both views and use a single linked Lab Supervisor line. Industry entries start with company and role context followed by contributions; IntRest’s description draws on its AI-service implementation and the work CV. Teaching entries retain their own materials without a generic recordings link. **Expand all** and **Collapse all** provide a reading or scanning view. The **Technical Skills Map** uses a fixed AI-first layout: three layers—Foundations, Systems & applications, and Production & delivery—across AI/ML engineering and Software engineering. Paired closed cards align their titles, concepts, tool rows, and outer edges. The overview separates concepts and methods from logo-led tools and frameworks, without repeated layer labels, descriptive filler, or evidence links inside the cards. Compact vertical layer labels accompany six native expandable cards; there are no display controls. A two-sentence introduction connects agentic coding tools such as Codex with the owner’s research and industry experience and ability to design, architect, deliver, and deploy AI applications. The English-language section presents verified TOEFL test-day and MyBest results in two compact score cards. Academic references follow in a compact contact layout with each referee’s affiliation and profile links. The **Download PDF** box pairs a small PDF document icon with the caption **Compact, conventional CV**. It sits beside the heading and introduction on desktop and below them on mobile, providing one clear download action without repeating the introduction. All CV content is available without JavaScript.

The homepage has an editorial layout with a framed portrait, a CV download beneath the photo, PhD availability in the introduction, and two illustrated publication features linked to the complete Publication page. Contact and profile icons sit in the footer. The layout adapts to small screens; articles retain their narrow reading column and the CV becomes a single-column timeline.

The **Publication** page at `/research/` lists papers in date order with **All**, **Published**, and **Preprints** filters and a Google Scholar link next to the page title. Each individual paper page shows its title, authors with Milad’s name in bold, publication status, authorship role, date, and paper/code links where available. The body contains the original abstract and one original main figure with its caption; the image opens at full size when clicked. It has no additional summaries, contents navigation, result charts, or citation sections. Homepage publication briefs, the publication list, and CV entries retain their own content.

The **PhD** page at `/phd/` introduces six research themes, including psychology and other human sciences. Compact numbered links lead to the themes and their short personal introductions. Native **Explore topics** disclosures hold 18 concise subject descriptions, keeping the overview readable; each control is named for its theme for assistive technology. Navigation links and direct theme URLs open the relevant topics. The personal sections explain why Milad wants to pursue a PhD and what prepares him for the work, followed by CV and publication links. **Let’s talk** welcomes PhD opportunities and introductions, research collaborations, and conversations, with an email link at the end. All text and disclosures work without JavaScript; printing opens every topic and restores the reader’s choices afterward. This page’s copy is maintained separately from the homepage research summary.

The **Blog** is temporarily disabled with `site.blog.enabled: false` in `src/config.js`. Its navigation link, index, posts, and feed/sitemap entries are omitted from the generated site; all blog code, styling, and Markdown content remain available. Set `site.blog.enabled` to `true` and rebuild when ready to publish writing. The Blog then provides a simple list of titles, short notes, and writing dates, with a narrow reading layout and section contents inside posts. The former `/projects/` and `/ideas/` indexes redirect to `/cv/` while the Blog is disabled, and to `/blog/` when enabled; individual project pages remain available through CV links.

Every route is generated as a complete HTML page for GitHub Pages. There is no CMS, server application, database, or analytics service. The reading font is self-hosted under the SIL Open Font License; the visitor's appearance preference is stored only in their browser.

## Run locally

Requires **Node.js 20 or newer** and npm.

```sh
npm ci
npm run dev
```

Open [localhost:4321](http://localhost:4321), or go directly to [the CV skills section](http://localhost:4321/cv/#cv-skills). The Technical Skills Map has a fixed AI-first presentation with native expandable cards; retired display-setting URLs and saved browser preferences do not alter it. Changes to `src/`, `content/`, and `public/` rebuild the site; refresh the browser to see them.

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
| `src/pages.js` | Home, PhD, collection pages, minimal paper pages, and project/blog article layouts |
| `src/phd-content.js` | PhD research themes, subjects, motivation, and personal background copy |
| `src/phd.js` / `src/phd.css` / `src/phd-client.js` | PhD page, linked research map, native topic disclosures, and direct-link/print behavior |
| `src/components.js` | Shared HTML layout, navigation, footer, formatting, and conceptual diagrams |
| `src/cv.js` | Introduction, highlights, compact CV entries, theme and timeline groups, and evidence links |
| `src/cv-client.js` | View changes, disclosure animation, bulk expansion, direct links, and print state |
| `src/cv-transcripts.js` | Same-page English transcript viewer, focus restoration, and inline fallback |
| `src/cv-sections.js` | Shared theme headings, introductions, and academic timeline chapters |
| `src/cv.css` | CV-specific timeline, thematic chapters, responsive layout, and visual styling |
| `src/cv-appendix.js` / `src/cv-appendix.css` | Skills integration, language score visualization, and references |
| `src/cv-skills.js` | Technical Skills Map introduction, six capability areas, concepts, and tools |
| `src/cv-skills.css` | Aligned Technical Skills Map, compact vertical layer labels, responsive presentation, and print styling |
| `src/site.js` | Appearance controls, mobile navigation, collection filters, article navigation |
| `src/site.css` | Light/dark palette, typography, responsive layout, motion, print styles |
| `content/research/` | Original abstracts and main-figure references, with metadata retained for publication summaries |
| `content/projects/` | Project and teaching-resource write-ups linked from the CV |
| `content/blog/` | Blog posts in Markdown, each with a title, short description, and writing date |
| `public/` | Images, licensed self-hosted fonts, downloadable CV, and other copied assets |
| `scripts/build.mjs` | Static generation, feeds, sitemap, and legacy redirects |

The compact skills inventory is maintained in `src/data/profile.json`. The web-specific layers, card headings, and tool/method relationships are authored in `src/cv-skills.js`. The six native cards work without a skills-specific client script and join the CV’s global expansion and print controls. Keep both sources in sync when adding or changing skills; the browser checks verify that the expanded web presentation retains every inventory keyword. The inventory includes the owner-confirmed foundations and capabilities plus named technologies evidenced in the PsyCIDRA, EmoNoria, and IntRest AI-service source. Android tools are labeled separately from web development. The AI systems overview includes OpenAI Agents SDK, Hugging Face Transformers, LangGraph, and Milvus logos; additional methods and tools remain available in the expanded cards. Layer names appear in the sidebar rather than repeating inside each card. The compact presentation is the default even without JavaScript.

Font attribution and redistribution terms are in `public/fonts/source-sans-3-OFL.txt`; the normal and italic Latin files are hosted locally. The site makes no font requests to Google or other third parties.

See **[Authoring content](docs/AUTHORING.md)** for Markdown templates, images, diagrams, and updating the CV.

The retained Blog content includes **“A place for unfinished thoughts”** (`content/blog/a-place-for-unfinished-thoughts.md`), a placeholder for reviewing the layout. It is not published while the Blog is disabled. Replace it with your writing or mark it `draft: true` before re-enabling the Blog. Its `sample: true` frontmatter adds a small **Sample post** label inside the article, while the index stays minimal. The old `content/ideas/` folder is no longer built. Publication-list entries link to primary sources and distinguish published papers from preprints.

## GitHub Pages

The default configuration targets the root user site, `mohammadi-milad.github.io`. For a project repository hosted below `/repository-name/`, build with:

```sh
BASE_PATH=/repository-name npm run build
```

Use that same `BASE_PATH` when running the local preview. Update `site.origin` in `src/config.js` if the domain changes; keep the repository prefix in `BASE_PATH`, not in the origin.

The deployment workflow is `.github/workflows/pages.yml`. When ready to publish, push the reviewed source to GitHub and select **Settings → Pages → Source → GitHub Actions**. For a project site, set `BASE_PATH` in the workflow's build environment as well. The workflow uploads `dist/`; the generated `.nojekyll` disables Jekyll processing.

This rewrite has been prepared locally. No push or deployment is part of the local build.
