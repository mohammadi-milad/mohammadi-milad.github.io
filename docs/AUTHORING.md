# Authoring content

Pages are plain Markdown files with YAML frontmatter. There is no publishing dashboard: edit a file, preview it locally, then build the static site.

## Choose a collection and filename

| Folder | Public route | Use |
| --- | --- | --- |
| `content/research/` | `/research/filename/` | Research questions, methods, findings, and publication records |
| `content/projects/` | `/projects/filename/` | Software projects, prototypes, and teaching resources linked from the CV |
| `content/blog/` | `/blog/filename/` | Essays, ideas, and notes on any subject |

Use lowercase letters, numbers, and hyphens: `modeling-individual-differences.md`. The filename determines the URL; changing it changes the public address. Choose a lasting name and add a redirect in the build script when moving an already published page.

The Blog index lives at `/blog/`. The old `/projects/` and `/ideas/` indexes redirect there, while individual project pages remain available for CV links. The old `content/ideas/` folder is no longer built; place new writing in `content/blog/`.

**Drafts stay out of the output.** Either add `draft: true` to the frontmatter or start the filename with an underscore. Remove the draft flag and use a filename without an initial underscore when ready to include the post in the generated site.

## A research overview

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
---
```

After the frontmatter, write the body in Markdown. A useful research structure is:

1. The question and why it matters.
2. The approach, with enough context to understand the system.
3. Your contribution, stated as precisely as the available evidence permits.
4. Findings, with the metric, model, dataset, cohort, or experimental condition attached to each number.
5. Limitations and the work's current publication status.
6. Links and a BibTeX citation.

Keep accepted publications, preprints, and work under review distinct. Link to the publisher or preprint record. A diagram explains the method; a chart needs actual reported results and its source. Selected charts for existing papers live in `src/pages.js` and are not automatically generated from frontmatter.

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
| `status` | Specific venue, preprint label, or project context; shown in the article header |
| `tags` | YAML array of topic labels; the research index filters by published or preprint status |
| `featured` | Set `true` to make research eligible for the home page's selected research |
| `diagram` | One of the conceptual diagram keys listed below; not used for blog posts |
| `paper` | Optional primary paper URL; adds a paper button |
| `code` | Optional public source repository URL; adds a code button |
| `authors` | Optional author line |
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

For research and project articles, method diagrams appear after the approach or workflow section. Existing result charts appear after the findings section. These are explanatory diagrams, not measured results. Blog posts receive no automatic diagrams. Choose one whose labels fit the research or project article. To add or customize a diagram, edit `diagram()` in `src/components.js` and its styles in `src/site.css`.

The homepage uses separate, compact SVG sketches for the selected PsyCIDRA and SchemaGraphSQL features. Their illustrations and feature layout are in `researchSketch()` and `featuredResearch()` in `src/components.js`; the full publication details remain on the research index and article pages.

## Body formatting, links, and media

Use `##` for article sections. Their headings automatically become links in the article contents navigation. The article title is already rendered from frontmatter, so a second `#` title in the body is unnecessary.

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

The downloadable PDF is a **separate document**. Replace `public/documents/milad-mohammadi-cv.pdf` with your updated PDF and update `src/data/profile.json` to match. This site does not generate the PDF from its data. The build also copies it to the legacy `/assets/pdf/MiladMohammadi_CV.pdf` address so existing links remain useful.

Site-wide email, public-profile links, the PhD availability flag, canonical domain, and review date live in `src/config.js`. Some page introductions and evidence summaries are authored in `src/pages.js`; review them when the underlying facts change.

## Before publishing

```sh
npm run build
npm run check
npm test
```

Review the pages locally in light and dark mode and at a narrow screen width. For CV changes, check search, both grouping views, individual entry expansion, and PDF download. For articles, verify the title, authorship, venue/status, links, and image descriptions.

The build writes only to `dist/`; edit source files rather than generated HTML. Publishing is a separate GitHub push and Actions workflow, described in the [project README](../README.md).
