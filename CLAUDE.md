# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Institutional landing page for **LUMO**, a software company. Single page, Portuguese
(`pt-BR`), dark theme. Four sections: hero, `#sobre`, `#servicos`, `#contato`.

## No build system — this is deliberate

Plain HTML/CSS/JS. No `package.json`, no bundler, no dependencies, no transpiler.
The only external resource is the Inter font from Google Fonts, with a system-font
fallback so the page works offline.

Do not introduce npm, a framework, or a build step without asking. "Zero build" was an
explicit product decision: the page must open by double-clicking `index.html` and
deploy by copying files to any static host.

Run it locally:

```bash
python3 -m http.server 8000
```

All paths are relative, so `file://` works too.

## Architecture

Three files that depend on each other in specific ways. The coupling is not obvious
from any one file:

**`script.js` → `index.html`.** The `services` array at the top of `script.js` is the
source of truth for the services section. `renderServices()` builds cards with
`createElement`/`textContent` (never `innerHTML`, so service text may contain `<` or
`&`) and injects them into `#services-grid`. Editing the array is the only way to
change that section.

**`<noscript>` mirrors the array.** `index.html` contains a `<noscript>` block listing
the same services in plain text, so the section is not empty without JS. It is a manual
copy — **changing `services` without updating `<noscript>` silently desyncs them.**
This is the single most likely thing to get wrong in this repo.

**`styles.css` `:root` is the whole design system.** Every color, radius, spacing step
and transition is a custom property. Restyling happens there, not in individual rules.
There are exactly two media queries: one at 720px for layout, one for
`prefers-reduced-motion`. The project grid is responsive via
`repeat(auto-fit, minmax(min(280px, 100%), 1fr))` with no media query at all. The
`min()` is load-bearing: a bare `minmax(280px, …)` gives the track a hard floor and
the cards overflow once the container is narrower than that (320px viewport with a
classic scrollbar, or 400% zoom), where `body { overflow-x: hidden }` clips them
silently instead of showing a scrollbar.

## Invariants that will break things if violated

**There are two accents, and they are not interchangeable.** `--accent` (indigo
`#6366f1`) is a *background* color: primary button, skip link, focus ring, hover
borders. `--accent-2` (emerald `#10b981`) is a *text* color on the dark background:
`.eyebrow`, `.section-label`, `.stat-value`, the wordmark dot. The split exists for
contrast, not decoration — indigo on `--bg` is only 4.0:1 and fails the 4.5:1 minimum
for small text, while emerald is 7.04:1. Do not "unify" them back into one token.

**`--accent-text` must contrast against `--accent`.** Indigo is a *dark* color, so
text on top of it is white — 4.47:1, which is 0.03 short of AA and the weakest pair
on the page; `--accent-hover` (`#4f46e5`) takes it to 6.29:1. Dark text on indigo
would be worse (4.0:1). If you change `--accent` to a light brand color, you must
flip `--accent-text` to something dark like `#0f172a`. Verify with a contrast
calculation, don't eyeball it.

**Service cards are `<article>`, not `<a>`.** They link nowhere, so they must not take
keyboard focus or present as clickable. The hover state is a subtle border change only
— no lift, no shadow, no arrow icon. Don't "improve" this into a link without a real
destination.

**The `.js` class handshake.** An inline script in `<head>` adds `class="js"` to
`<html>` before first paint. `styles.css` hides `.reveal` elements *only* under `.js`,
so the scroll fade-in works with JS and the content is simply visible without it.
Moving that script to the end of `<body>` or into `script.js` causes a
flash-then-hide. The reveal also short-circuits under `prefers-reduced-motion`.

## Verification

There is no test framework. These static checks have each caught real bugs here and are
worth re-running after edits:

```bash
node --check script.js                       # JS syntax
python3 -m http.server 8000                  # visual check
```

Beyond that, verify by parsing rather than by eye:

- **HTML tags balanced, and every `href="#x"` has a matching `id="x"`.** Python's
  `html.parser` does this in a few lines. Anchor/id drift is easy to introduce when
  renaming a section.
- **CSS braces balanced; every `var(--x)` is defined; no class used in HTML/JS lacks a
  rule; no token defined but unused.** The class check is what proves a rename was
  carried through all three files.
- **`renderServices()` output**, by stubbing a minimal DOM in Node
  (`createElement`/`createDocumentFragment`/`getElementById`) and importing `script.js`.
  Assert the cards are `<article>`, carry no `href`, and that every rendered title also
  appears inside the `<noscript>` block — that last assertion catches the desync above.

**No headless browser is available on this machine.** Playwright's Chromium is
downloaded but missing ten system libraries (`libnss3`, `libgbm`, `libatk`…).
Installing them needs `sudo npx playwright install-deps chromium`, which is the user's
call. Until then, screenshots and rendered-layout checks are not possible — say so
rather than claiming visual verification.

## Content placeholders

The page ships with placeholder company data. `README.md` lists what must be replaced
before publishing (`contato@lumo.com.br`, `55DDDNUMERO`, the domain, the CNPJ, and the
three figures in the `.stats` block). Contact details are consolidated in one commented
block at the top of `<head>`.

Copy is institutional first-person-plural ("a LUMO entrega"), not personal — the page
began as a personal portfolio and was converted; do not reintroduce "eu"/"meu" phrasing.
