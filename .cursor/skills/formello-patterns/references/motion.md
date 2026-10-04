# Motion system

Keep one motion language across the Formello landing.

## Timing

| Constant | Value | Use |
|----------|-------|-----|
| `FADE_MS` | `220` | Language swap, form ↔ success crossfade |
| `MODAL_MS` | `240` | Modal open / close |

Defined in `script.js`. Reuse these constants; do not invent parallel durations.

## Shared fade recipe

- opacity: `0 → 1`
- transform: `translateY(4px) → 0`
- CSS: `transition: opacity 0.22s ease, transform 0.22s ease`

### Language swap

1. Add `body.is-lang-fading`
2. Wait `FADE_MS`
3. Swap texts via `setTexts(lang)`
4. Remove `body.is-lang-fading`

Targets: `[data-i18n]`, `[data-i18n-html]`, `.lang__code`

### Modal open / close

- Backdrop + dialog: opacity / translateY+scale over `MODAL_MS`
- Lock page scroll with `--scrollbar-comp` so layout does not jump
- Unlock on close after animation finishes

### Form → success

1. `.modal__view.is-fading-out` on form (`FADE_MS`)
2. Hide form, show success with `.is-fading-in`
3. Next frame: remove `.is-fading-in` so success fades in (`FADE_MS`)

## Reduced motion

Honor `prefers-reduced-motion: reduce`:

- Skip timed fades; apply final state immediately
- Disable CSS transitions/animations listed in `styles.css`

## Do / don’t

- Do reuse `FADE_MS` / `MODAL_MS`
- Do keep easing `ease` unless matching an existing curve
- Don’t add a second animation system (springs, long delays, bounce)
- Don’t leave scroll unlock / focus restore out of close handlers
