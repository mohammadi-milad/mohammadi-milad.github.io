# Authoring content

Pages are plain Markdown files with YAML frontmatter. There is no publishing dashboard: edit a file, preview it locally, then build the static site.

## Choose a collection and filename

| Folder | Public route | Use |
| --- | --- | --- |
| `content/research/` | `/research/filename/` | Paper abstracts and main research figures |
| `content/projects/` | `/projects/filename/` | Software projects, prototypes, and teaching resources linked from the CV |
| `content/blog/` | `/blog/filename/` | Essays, ideas, and notes on any subject |

Use lowercase letters, numbers, and hyphens: `modeling-individual-differences.md`. The filename determines the URL; changing it changes the public address. Choose a lasting name and add a redirect in the build script when moving an already published page.

The Blog index lives at `/blog/`. The old `/projects/` and `/ideas/` indexes redirect there, while individual project pages remain available for CV links. The old `content/ideas/` folder is no longer built; place new writing in `content/blog/`.

**Drafts stay out of the output.** Either add `draft: true` to the frontmatter or start the filename with an underscore. Remove the draft flag and use a filename without an initial underscore when ready to include the post in the generated site.

## A paper page

```yaml
---
title: "Full paper title"
shortTitle: "A short name for cards and navigation"
description: "A clear, one-sentence account of the question or contribution."
date: "2026-11-06"
kind: "Research preprint"
role: "First author"
status: "arXiv · 2026"
tags: ["Language agents", "Evaluation"]
featured: false
diagram: "agent"
paper: "https://example.org/paper"
code: "https://github.com/owner/repository"
authors: "Author One, Author Two, and Author Three"
mainFigure:
  src: "/images/research/paper-main.png"
  caption: "Figure 1: The original figure caption."
  alt: "Describe the main workflow, components, and relationships shown in the figure."
  width: 1600
  height: 900
---

## Abstract

The original paper abstract.
```

The paper page displays its title, authors with Milad’s name in bold, status, authorship role, date, and paper/code links where available. Its body contains the abstract in Markdown and one original main figure from `mainFigure`, followed by its original caption. Keep the body to `## Abstract` and the paper's original abstract. Place the figure in `public/images/research/`, use its actual dimensions, and provide descriptive alternative text. The image opens at full size when clicked.

Homepage features, publication-list entries, and CV summaries still use the existing frontmatter. Preserve their descriptions, authors, roles, status, links, tags, and `diagram` values when changing only a paper's inside page. Paper pages retain author metadata and paper/code links. They do not render extra summary text, contents navigation, added method diagrams, result charts, or citation sections.

## A blog post

Create a Markdown file in `content/blog/` with three required fields:

```yaml
---
title: "A place for unfinished thoughts"
description: "A few notes on curiosity, writing, and leaving room for ideas to change."
date: "2026-11-07"
---
```

Use a short description for the note below the title in the Blog index. The writing date must be a quoted `"YYYY-MM-DD"` string. Posts are listed newest first, with only a title, description, and date.

Write the body in Markdown and use `##` headings for sections. These headings automatically become links in the post's simple table of contents. Blog posts do not receive automatic method diagrams.

The included `content/blog/a-place-for-unfinished-thoughts.md` is a placeholder for layout review at `/blog/a-place-for-unfinished-thoughts/`. Edit or remove it when adding your own writing. Its `sample: true` field adds a small **Sample post** label inside the article; that label does not appear in the index. Remove `sample: true` when replacing the placeholder with a finished post.

## A project

```yaml
---
title: "Project title"
shortTitle: "Short title"
description: "What the reader will find here."
kind: "Project"
status: "Prototype"
tags: ["Language agents", "Python"]
featured: false
diagram: "agent"
draft: true
---
```

For a project, describe the problem, workflow, your role, and what is actually implemented. Include a `code` URL when the repository is public. Identify course exercises and prototypes as such.

## Frontmatter reference

Every entry requires `title` and `description`. Blog posts also require a quoted `date` in `"YYYY-MM-DD"` format. The remaining fields shape the presentation:

| Field | How it is used |
| --- | --- |
| `shortTitle` | Compact title on collection cards and in browser-page titles; full title remains on the article |
| `date` | Required for blog posts and optional elsewhere; a quoted ISO date, `"YYYY-MM-DD"`, used in ordering, display, RSS, and structured metadata |
| `sample` | Set `true` to show a small Sample post label inside a blog article, without adding it to the index |
| `kind` | Research or project content type, such as `Research paper`, `Research preprint`, `Teaching project`, or `Project`; not needed for blog posts |
| `role` | Your verified authorship or project role |
| `status` | Specific venue, preprint label, or project context; research status appears in paper headers, collection entries, and homepage entries |
| `tags` | YAML array of topic labels; the research index filters by published or preprint status |
| `featured` | Set `true` to make research eligible for the home page's selected research |
| `diagram` | Conceptual diagram key for project pages and homepage research sketches; not used inside paper pages or blog posts |
| `mainFigure` | Required for research pages: root-relative `src`, original `caption`, descriptive `alt`, and actual pixel `width` and `height`; optional `source` records the figure’s origin |
| `paper` | Optional primary paper URL; used in paper headers, publication-list and homepage links, and structured metadata |
| `code` | Optional public repository URL; used in paper headers, collection, homepage, CV, and project links |
| `authors` | Optional author line for paper headers, publication-list and CV entries |
| `draft` | Set `true` to omit the file completely from generated pages and feeds |

Omit an unknown date for research or project records rather than guessing. For blog posts, choose the writing date and quote it so YAML reads it as a string. Research and blog posts are sorted newest first. Drafts and underscore filenames are excluded from the collections, sitemap, and feed.

## Diagrams

The `diagram` field selects a small conceptual illustration, rendered from HTML and CSS:

| Key | Current use |
| --- | --- |
| `psycidra` | Interview, evidence, and diagnostic reasoning |
| `schema` | Question, schema graph, and SQL |
| `emotion` | Text, role-play rewriting, and comparison |
| `medical` | Medical question-answering evaluation |
| `retrieval` | Documents, index, and retrieval |
| `agent` | Question, tools, and response |

For project articles, method diagrams appear after the approach or workflow section. These are explanatory diagrams, not measured results. Paper pages use their original `mainFigure` instead; blog posts receive no automatic diagrams. Choose a diagram whose labels fit the project article. To add or customize a diagram, edit `diagram()` in `src/components.js` and its styles in `src/site.css`.

The homepage uses separate, compact SVG sketches for the selected PsyCIDRA and SchemaGraphSQL features. Their illustrations and feature layout are in `researchSketch()` and `featuredResearch()` in `src/components.js`; publication metadata appears on the research index and paper headers, while paper bodies contain only the abstract and main figure with its caption.

## Body formatting, links, and media

Use `##` for article sections. Project and blog headings automatically become links in the article contents navigation; paper pages have no contents navigation. The article title is already rendered from frontmatter, so a second `#` title in the body is unnecessary.

Markdown supports lists, blockquotes, tables, links, images, and fenced code blocks. Trusted author-written HTML is also rendered directly; use semantic HTML and useful alternative text for media.

Place images in `public/images/` and reference them from the site root:

```md
![A descriptive explanation of the figure](/images/my-experiment.png)

[Related research](/research/schemagraphsql/)
```

The build prefixes root-relative `href` and `src` attributes with `BASE_PATH`, so these links work for both the root site and a GitHub project site. Do not include `/public/` in the public URL. Give externally hosted links their full `https://` address.

For more control over image sizing, use HTML:

```html
<figure>
  <img src="/images/my-experiment.png" width="1200" height="700"
       loading="lazy" alt="Describe the important pattern in the plot">
  <figcaption>Dataset, metric, experimental condition, and source.</figcaption>
</figure>
```

BibTeX can be included in a fenced block marked `bibtex`, as in the existing research pages. Keep the original paper's title, author order, venue, year, and identifier. Code blocks are displayed as readable text; there is no executable notebook service.

## Updating the interactive CV

The CV reads its content from `src/data/profile.json`; `src/cv.js` turns those fields into expandable entries. Edit the structured education, publication, research, work, teaching, project, award, and service records there. Research positioning and the PhD introduction are also in that file.

The CV renderer generates entry IDs and deep links from record fields, short titles, and category-specific rules. After renaming or adding entries, check existing links to `#cv-…` in `src/pages.js`, then test both timeline and theme views. Keep dates and source links accurate; an empty end date indicates a current role.

The school entry uses a concise descriptive institution label and retains the established English organization name in `officialName`, shown in its expanded details. Education, award, and service records have stable `id` fields, such as `high-school` or `tedx-kish`, used to form their `#cv-…` links. Theme headings, short timeline labels (`label`, falling back to `title`), and timeline chapters live in `src/cv-sections.js`. Timeline entries show one theme label alongside their date, using the matching `--category-*` color in `src/site.css` with a soft tinted fill and border. Keep category colors in sync across the light, explicit dark, and system dark palette blocks. Theme view hides those labels because the section heading supplies the category. Timeline view reads newest first: PhD availability, master’s, the entrance-exam bridge, bachelor’s, and school. Chapter headers omit a date subtitle before the bachelor’s; individual entries retain their dates. Within the master’s, the degree overview precedes year three, year two, and year one. Academic years use September boundaries and records within stages run newest first. Roles appear when they start and retain their full date ranges; papers use their publication dates. PsyCIDRA is grouped into **Year three** as the master’s thesis publication, preserving its October 2026 preprint date after September graduation. TEDx appears once in the pre-bachelor’s chapter.

Set `showInCV: false` on a project record to exclude it from both CV views while retaining its data and standalone write-up. Text-to-Insight and MedYar currently use this setting. Empty themes are omitted and remaining theme headings are numbered consecutively.

For a project known only by season, use year-only `startDate` / `endDate` and a `dateLabel` such as `Spring 2024` or `Summer 2025`. The renderer preserves that precision and uses the season for reading order. Avoid inventing exact dates.

The downloadable PDF is a **separate document**. Replace `public/documents/milad-mohammadi-cv.pdf` with your updated PDF and update `src/data/profile.json` to match. This site does not generate the PDF from its data. The build also copies it to the legacy `/assets/pdf/MiladMohammadi_CV.pdf` address so existing links remain useful.

Site-wide email, public-profile links, the PhD availability flag, canonical domain, and review date live in `src/config.js`. Some page introductions and evidence summaries are authored in `src/pages.js`; review them when the underlying facts change.

## Before publishing

```sh
npm run build
npm run check
npm test
```

Review the pages locally in light and dark mode and at a narrow screen width. For CV changes, check both grouping views, chapter placement, individual entry expansion, and PDF download. For articles, verify the title, authorship, venue/status, links, and image descriptions.

The build writes only to `dist/`; edit source files rather than generated HTML. Publishing is a separate GitHub push and Actions workflow, described in the [project README](../README.md).
