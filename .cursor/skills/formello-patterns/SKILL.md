---
name: formello-patterns
description: Applies Formello landing patterns for UK/EN i18n, motion, design tokens, and the request modal form. Use when editing Formello UI, language toggle, animations, CTA/request form, or styles in index.html, styles.css, or script.js.
icon: rocket
color: cyan
---

# Formello patterns

Keep new UI consistent with the existing static landing in `index.html`, `styles.css`, and `script.js`.

## Stack

- Plain HTML/CSS/JS only (no framework)
- Font: **Onest** — weights **400** (Regular) and **600** (SemiBold) only
- Prefer CSS/SVG over raster assets

## Design tokens

Reuse `:root` variables from `styles.css` (canonical snippet: [assets/tokens.snippet.css](assets/tokens.snippet.css)):

- `--bg: #010106`
- `--text: #ffffff`
- `--text-muted: rgba(255, 255, 255, 0.72)`
- `--accent: #6fccff`
- `--cta-fill`, `--cta-border`, `--cta-glow` for buttons/modals
- Frame feel: ~1440 desktop, content `--container: 1200px`, `--pad-x`

New surfaces (cards, inputs, dialogs) must match the dark navy + cyan glow CTA language.
Logo mark SVG: [assets/logo-mark.svg](assets/logo-mark.svg).

## Typography (desktop)

Onest only; do not use weights 500 or 700. Mobile may `clamp()` down to these desktop caps.

| Token | Weight | Size | Line-height | Use |
|-------|--------|------|-------------|-----|
| h1 (`--fs-h1` …) | 600 | 72px | 1.2 | Hero title |
| h2 | 600 | 64px | 1.2 | Section titles (e.g. mission) |
| h3 | 400 | 56px | 1.2 | Reserved for future large Regular heads |
| h4 | 600 | 36px | 1.2 | Logo name, mission card titles, modal title |
| h5 | 400 | 36px | 1.2 | Hero subtitle |
| body | 400 | 24px | 1.5 | Paragraphs, modal lead |
| body-btn (`--fs-btn`) | 400 | 24px | 1.2 | Nav, lang, CTA |

Utilities: `.type-h1` … `.type-h5`, `.type-body`, `.type-btn`.

**Exceptions (not in scale):** `.logo__tag` (12px), `.field__error` (12px), `.mission__num` (decorative oversized numerals).

**Request modal chrome** (compact, no internal scroll): title ~28px / 600; lead 16px; labels 14px; inputs 16px; submit CTA 18px. Name + email sit in two columns from 521px up.

Load Google Fonts as `Onest:wght@400;600` only.
## UK/EN language toggle

- Codes are **UK** / **EN** (not UA)
- Source of truth: `translations.uk` / `translations.en` in `script.js`
- Mark copy with:
  - `data-i18n` — textContent
  - `data-i18n-html` — innerHTML (titles with `<br>`)
  - `data-i18n-aria` — aria-label
  - `data-i18n-placeholder` — placeholders
- Persist with `localStorage` key `formello-lang`
- Chevron: UK points down; EN points up via `.lang[data-lang="en"] .lang__chevron { transform: scaleY(-1); }`
- Any new visible string needs both `uk` and `en` keys

Full checklist: [references/i18n-checklist.md](references/i18n-checklist.md)

Validate keys:

```bash
node .cursor/skills/formello-patterns/scripts/check-i18n.js
```

## Motion system

Match existing timing and easing; do not invent a second motion language.

| Constant | Value | Use |
|----------|-------|-----|
| `FADE_MS` | `220` | Language swap, form↔success view crossfade |
| `MODAL_MS` | `240` | Modal open/close |

Shared fade recipe: opacity + `translateY(4px)`, `0.22s ease`.  
Details: [references/motion.md](references/motion.md)

Always respect `prefers-reduced-motion: reduce`.

## Request modal form

- Open from `[data-open-request]` (hero CTA)
- Close via `[data-close-request]`, `Escape`, or backdrop click
- Fields: name, email, phone, message — validate per field with localized errors
- Valid submit: fade form out, then fade success view in (same `FADE_MS` recipe)
- Modal chrome reuses CTA border/glow tokens

## New sections

Start from [assets/section-boilerplate.html](assets/section-boilerplate.html), then wire UK/EN keys and reuse tokens/motion.

## When changing UI

1. Extend tokens/classes instead of one-off colors
2. Wire i18n attributes + both language dictionaries
3. Reuse `FADE_MS` / `MODAL_MS` motion
4. Keep lowercase CTA/nav labels as in the design
5. Run `check-i18n.js` after copy changes

## Project hooks

`.cursor/hooks.json` auto-runs i18n check after Agent edits to `index.html` / `script.js`, and asks before destructive git (`push --force`, `reset --hard`, `clean -fd`, `branch -D`). See Hooks output channel if a check fails.
