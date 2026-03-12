# Listing Pager Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add true multi-page pager navigation to home, archive, tag, and category listing pages, using Hexo-generated routes and a shared bottom-left pager UI.

**Architecture:** Keep pagination data owned by Hexo's generators, normalize display-only logic in helpers, and render one shared `pager` partial from all post-list templates. Validate with a build-driven Node test that forces multi-page output from the sample site.

**Tech Stack:** Hexo 7, EJS templates, SCSS, Node test runner, pnpm

---

### Task 1: Build the failing pagination coverage test

**Files:**
- Create: `test/listing-pager.test.mjs`
- Read: `_config.yml`
- Read: `themes/hexo-theme-mingyue/layout/index.ejs`
- Read: `themes/hexo-theme-mingyue/layout/archive.ejs`
- Read: `themes/hexo-theme-mingyue/layout/tag.ejs`
- Read: `themes/hexo-theme-mingyue/layout/category.ejs`

**Step 1: Write the failing test**

Write a build-driven test that:

- creates a temporary copy of the site
- lowers pagination size in the copied `_config.yml`
- runs `pnpm run clean` and `pnpm build` in that temp site
- asserts generated files exist for `/page/2/`, `/archives/page/2/`, one tag page 2, and one category page 2
- asserts first-page HTML contains a pager shell and Chinese uppercase page label
- asserts first page hides the previous arrow and second page hides the next arrow in the right places

**Step 2: Run test to verify it fails**

Run: `node --test test/listing-pager.test.mjs`

Expected: FAIL because the generated HTML does not yet contain pager markup and home does not yet consume paginated page data.

**Step 3: Keep the failure focused**

Refine the assertions until the failure points at missing pager behavior rather than temp-site setup errors.

**Step 4: Commit checkpoint**

```bash
git add test/listing-pager.test.mjs
git commit -m "test: cover listing pager generation"
```

### Task 2: Add pagination helpers and shared pager partial

**Files:**
- Modify: `themes/hexo-theme-mingyue/scripts/helpers.js`
- Modify: `themes/hexo-theme-mingyue/index.js`
- Create: `themes/hexo-theme-mingyue/layout/partial/pager.ejs`

**Step 1: Write the failing helper expectations**

Extend `test/listing-pager.test.mjs` with assertions for:

- Chinese uppercase page labels such as `壹` and `貳`
- pager links using the generated page-2 routes
- hidden-arrow placeholders on edge pages

**Step 2: Run test to verify it fails**

Run: `node --test test/listing-pager.test.mjs`

Expected: FAIL with missing numeral conversion or missing pager HTML markers.

**Step 3: Write minimal implementation**

Implement helper support that:

- converts positive integers to Chinese uppercase numerals for page labels
- derives pager state from Hexo page data (`current`, `total`, `prev_link`, `next_link`)

Create `layout/partial/pager.ejs` that:

- renders only when `total > 1`
- renders previous and next arrow anchors when links exist
- renders inert placeholders when links do not exist
- uses Font Awesome angle icons and the helper-generated label

**Step 4: Run test to verify it passes**

Run: `node --test test/listing-pager.test.mjs`

Expected: The test still fails only on template integration or CSS hooks, not on helper output.

**Step 5: Commit checkpoint**

```bash
git add themes/hexo-theme-mingyue/scripts/helpers.js themes/hexo-theme-mingyue/index.js themes/hexo-theme-mingyue/layout/partial/pager.ejs test/listing-pager.test.mjs
git commit -m "feat: add shared listing pager helper"
```

### Task 3: Integrate pager into all listing templates

**Files:**
- Modify: `themes/hexo-theme-mingyue/layout/index.ejs`
- Modify: `themes/hexo-theme-mingyue/layout/archive.ejs`
- Modify: `themes/hexo-theme-mingyue/layout/tag.ejs`
- Modify: `themes/hexo-theme-mingyue/layout/category.ejs`

**Step 1: Write the failing template assertions**

Ensure the test explicitly checks:

- home page 1 and page 2 render paginated subsets rather than the old sliced list
- archive, tag, and category pages include the shared pager partial output

**Step 2: Run test to verify it fails**

Run: `node --test test/listing-pager.test.mjs`

Expected: FAIL because the list templates do not yet render the pager and home still uses local post slicing.

**Step 3: Write minimal implementation**

Update the templates to:

- read paginated posts from `page.posts` when available
- fall back safely for single-page contexts
- render the shared pager partial after the list content

For the home page, remove the local `slice(...)` truncation so paginated index pages reflect Hexo's generated data.

**Step 4: Run test to verify it passes**

Run: `node --test test/listing-pager.test.mjs`

Expected: PASS for markup and generated-route assertions.

**Step 5: Commit checkpoint**

```bash
git add themes/hexo-theme-mingyue/layout/index.ejs themes/hexo-theme-mingyue/layout/archive.ejs themes/hexo-theme-mingyue/layout/tag.ejs themes/hexo-theme-mingyue/layout/category.ejs test/listing-pager.test.mjs
git commit -m "feat: wire pager into listing templates"
```

### Task 4: Style and verify the fixed bottom-left pager

**Files:**
- Modify: `themes/hexo-theme-mingyue/source/css/_components.scss`
- Test: `test/listing-pager.test.mjs`

**Step 1: Write the failing style assertions**

Add CSS assertions for:

- a dedicated pager block selector
- `position: fixed`
- left and bottom offsets
- accent-color text/icon styling
- hidden placeholder styling for disabled arrows

**Step 2: Run test to verify it fails**

Run: `node --test test/listing-pager.test.mjs`

Expected: FAIL because the stylesheet does not yet expose pager rules.

**Step 3: Write minimal implementation**

Add pager styles that:

- anchor the pager at the bottom-left of the viewport
- keep a compact horizontal arrangement
- color active icons and label with the accent color
- preserve width with invisible placeholders on first/last pages
- scale down spacing and type size on small screens

**Step 4: Run test to verify it passes**

Run: `node --test test/listing-pager.test.mjs`

Expected: PASS.

**Step 5: Run broader verification**

Run: `node --test test/post-reading-typography.test.mjs test/listing-pager.test.mjs`

Expected: PASS.

**Step 6: Commit checkpoint**

```bash
git add themes/hexo-theme-mingyue/source/css/_components.scss test/listing-pager.test.mjs
git commit -m "feat: style fixed listing pager"
```

### Task 5: Final verification

**Files:**
- Read: `public/index.html`
- Read: `public/page/2/index.html`
- Read: `public/archives/index.html`
- Read: `public/archives/page/2/index.html`

**Step 1: Rebuild the real workspace site**

Run: `pnpm run clean`

Run: `pnpm build`

Expected: Hexo generate succeeds.

**Step 2: Verify output**

Confirm the built HTML and CSS contain the shared pager and expected routes.

**Step 3: Final status check**

Run: `git status --short`

Expected: Only intended changes are present.
