# i18n checklist (UK / EN)

Language codes on the toggle are **UK** and **EN** (not UA).

## Source of truth

- Dictionaries: `translations.uk` / `translations.en` in `script.js`
- Persistence: `localStorage` key `formello-lang`
- Document language: `document.documentElement.lang` (`uk` / `en`)

## Attribute map

| Attribute | Applies |
|-----------|---------|
| `data-i18n` | `textContent` |
| `data-i18n-html` | `innerHTML` (titles with `<br />`) |
| `data-i18n-aria` | `aria-label` |
| `data-i18n-placeholder` | `placeholder` |

## Before shipping UI copy

- [ ] New string has keys in **both** `uk` and `en`
- [ ] HTML uses the matching `data-i18n*` attribute
- [ ] Error messages used only in JS (`err*`) exist in both dictionaries
- [ ] Nav / CTA stay **lowercase** as in the design
- [ ] Chevron: UK down, EN up (`scaleY(-1)`)
- [ ] Run `node .cursor/skills/formello-patterns/scripts/check-i18n.js`

## Key naming

Prefer camelCase by area:

- `navPortfolio`, `heroTitle`, `formName`, `errEmailInvalid`

## Validation

```bash
node .cursor/skills/formello-patterns/scripts/check-i18n.js
```

Exit `0` = OK. Non-zero = missing or mismatched keys.
