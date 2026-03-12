# Listing Pager Design

## Context

The theme already renders several post-list surfaces: the home page, archives, tags, and categories. They share a strong visual language, but they do not yet share pagination behavior.

Right now:

- the home page manually truncates posts with `slice(...)`
- archive, tag, and category templates render whatever `page.posts` contains
- none of the list pages expose navigation between pages

The user wants true multi-page static routes, not client-side switching. The pager should sit at the bottom-left of the viewport, use the theme accent color, render Font Awesome arrows, and show a centered Chinese uppercase page number such as `壹`.

## Goals

- Add true Hexo pagination routes to every post-list page that should page through posts.
- Keep one shared pager UI across home, archive, tag, and category templates.
- Match the requested visual treatment: accent-color arrows, bottom-left viewport placement, and Chinese uppercase page labels.
- Avoid changing the existing post-card content design beyond what pagination requires.

## Non-Goals

- Redesign the listing shell or post-card layout.
- Add numeric page lists or a large pagination bar.
- Introduce client-side pagination logic.

## Approach

### Use Hexo's Native Pagination Data

The theme should rely on Hexo's generated pagination pages instead of inventing a second routing layer.

- Home should stop slicing `site.posts` directly and instead read the paginated post collection already exposed on paginated index pages.
- Archive, tag, and category pages should continue using the posts provided by Hexo's generators, but now also read page-to-page navigation metadata.
- The templates should consume normalized page metadata such as current page number, total page count, previous page URL, and next page URL.

This keeps the result aligned with static generation, canonical page URLs, and the existing Hexo plugin model.

### Shared Pager Partial

The pager markup should live in a single partial, rendered by each list template after the post list.

The partial should:

- render only when the current list has more than one page
- show a previous arrow on the left and a next arrow on the right
- use Font Awesome icons for both arrows
- show the current page number in Chinese uppercase numerals between them
- hide unavailable arrows on first and last page while keeping visual balance

Keeping this logic in one partial avoids repeating page-state checks in every template.

### Chinese Uppercase Page Labels

Page numbers should be converted from Arabic numerals to Chinese uppercase numerals in a helper, not inline in templates.

This keeps templates readable and makes the numeral format reusable. The initial scope only needs positive page numbers used by pagination.

### Layout Behavior

The pager should be positioned relative to the viewport, not the content width, so it stays anchored at the bottom-left of the page even when the main shell grows horizontally.

Visual rules:

- accent color for icons and current page label
- compact horizontal layout resembling `〈 壹 〉`
- transparent or paper-like background that fits the current theme
- responsive size reduction on narrow screens

## Template Impact

- `layout/index.ejs`: switch from local slicing to paginated page data
- `layout/archive.ejs`: keep archive list rendering and attach shared pager
- `layout/tag.ejs`: keep tag list rendering and attach shared pager
- `layout/category.ejs`: keep category list rendering and attach shared pager
- `layout/partial/pager.ejs`: new shared pager partial

## Styling Impact

Pager-specific rules should be added to the theme stylesheet as a dedicated component block. The styles should avoid interfering with existing vertical-writing content areas.

## Validation

Verification should cover both generated routes and rendered pager states.

- Home generates and renders `/page/2/` when there are more posts than the configured page size.
- Archive, tag, and category list pages render a pager when multiple pages exist.
- First-page pager hides the previous arrow.
- Last-page pager hides the next arrow.
- The middle label renders Chinese uppercase page numerals.
- The pager remains fixed to the bottom-left of the viewport on desktop and mobile widths.
