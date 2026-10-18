# Burger Life evaluation

Evaluated on 16 October 2026 against the three local commits after the Vite baseline:

- `7706f20` selling page
- `5a0e335` cart-success motion only
- `a419f50` subscription sign-in screen

The page was opened at `http://127.0.0.1:5173/`. Screenshots live in `DOCS/assets/burger-life/`. Skill wording listed at the end is not applied in this pass.

## Rubric

| Check | Score | Evidence |
| --- | --- | --- |
| Origin | 3 | Registry pieces are on disk. The sign-in screen is not the `login-01` block. |
| Licenses | 5 | Free catalog only. No Pro package, no Icons8, no bulk Lottie download. |
| Lane discipline | 4 | The motion session left `DESIGN.md` and theme tokens alone. |
| Style | 4 | One `DESIGN.md`, one tweakcn theme, no generic cream-and-terracotta shell. |
| Motion | 3 | Reduced motion drops the spotlight animation. Press scale is missing. |
| Accessibility and responsive | 3 | Labels, skip link, and an inline error exist. One control clips at 390px. |
| Copy | 5 | Missing studies, reviews, and certificates are marked, not invented. |
| Build | 5 | `npm run build` passed. Lint exited 0 with warnings in generated files. |

### Origin — 3

Installed from registries and left recognizable:

- `@aceternity/spotlight` in `examples/burger-life/src/components/ui/spotlight.tsx`
- `@magicui/confetti` in `examples/burger-life/src/components/ui/confetti.tsx`
- shadcn `button`, `card`, `field`, `input`, `label`, `alert`, `accordion`, `badge`, `separator`
- `@react-bits/StatusMark-TS-TW` in `examples/burger-life/src/components/StatusMark.tsx`

`examples/burger-life/src/components/ui/card.tsx` does not match the new-york registry JSON. The CLI installed the project's `base-nova` card. That is the project style, not a handwritten replacement.

`examples/burger-life/src/components/login-form.tsx` is a new composition of `Card`, `Field`, `Input`, `Button`, and `Alert`. It is not `blocks/login-01`. The session reported `npx shadcn@latest add login-01`, and `package.json` did not change in `a419f50`. This is the main origin miss.

### Licenses — 5

`npm ls` shows no `@magicui-pro`, React Bits Pro, or Icons8 package. The illustration lane stayed closed, so no Lottie file and no `public/animations/CREDITS.md` were added. The plan expected one licensed Lottie on subscribe success. The skill allows a catalog success component instead, and the page uses confetti. That is a skill-versus-plan gap, not a license breach.

The catalog verifier rejects a planted `@magicui-pro` record. Confetti, spotlight, and StatusMark are free-tier catalog ids.

### Lane discipline — 4

`5a0e335` adds `src/components/flavor-cart.tsx`, `src/components/StatusMark.tsx`, the React Bits dependency, and four lines in `src/App.tsx`. `DESIGN.md` and the theme tokens in `src/index.css` are not in that diff. The cart control did not exist before the session, so a new component file was the narrow place for the animation. A second add says the flavor is already in the cart and does not replay the mark.

### Style — 4

`examples/burger-life/DESIGN.md` is the only style file. The theme is tweakcn `modern-minimal`. Type is Unbounded and Golos Text, both with Cyrillic. The first screen is a yellow field with a dark type headline, shown in `DOCS/assets/burger-life/burger-life-1440.png`. It does not use the Inter-plus-cream template the frontend-design skill warns about.

The flavor line stays sparse because the brief did not name flavors. The page says the packs are not on the shelf yet instead of inventing flavor names.

### Motion — 3

With `prefers-reduced-motion: reduce` emulated, `matchMedia` was true and `.animate-spotlight` computed `animation-name: none`. Opacity and color of the yellow field stayed. The same element still had a translate matrix, so the reduced-motion rule is only partly met.

Buttons transition `transform` and `opacity` over 150ms. No `scale(0.97)` or `active:scale` exists under `src/`. The sign-in feedback class drops transform under reduced motion and keeps the opacity transition. Typing in the email field is not animated. The first successful cart add shows the status mark.

### Accessibility and responsive — 3

Checked against the Vercel Web Interface Guidelines and the review-animations rule (transform and opacity, reduced motion, no animation on typing):

- Skip link, heading order, and a named nav are present.
- The email field has a label. An empty submit marks it invalid and shows "Введите почту целиком, с символом @ и доменом." See `DOCS/assets/burger-life/burger-life-error.png`.
- A valid submit replaces the form with "Почта записана на старт". See `DOCS/assets/burger-life/burger-life-success.png`.
- The success swap has no `aria-live` region, so the change is easy to miss in a screen reader.
- At a 390px layout width the nav wraps and the hero stacks (`DOCS/assets/burger-life/burger-life-390.png`). The side-card label is cut to "Записать почту на ста". The white area to the right of that shot is the browser surface outside the emulated layout viewport (`innerWidth` was 390), not a second page column.

### Copy — 5

The brief forbade invented clinical studies, reviews, and certificates. The page marks those gaps with "Content requirement", including certificates and the missing privacy text. FAQ states that the food is not a burger for people and that the form does not charge a subscription.

### Build — 5

After the sign-in session, `npm run build` completed typecheck and the production bundle. `npm run lint` exited 0. Remaining warnings are `react/only-export-components` in the generated `button.tsx` and `badge.tsx`.

## What to change in the skill

Do not apply these until the wording is reviewed.

1. In `skills/visual-craft/SKILL.md`, after a named block install, require a string that exists only in the registry file to remain on disk. `login-01` was reported as installed while `login-form.tsx` was written by hand.
2. In `skills/visual-craft/motion.md`, say the installed button keeps an active scale near 0.97. The current line states the scale, and the sign-in session never put it on the control. Also say reduced motion sets the effect element's `transform` to `none`, not only `animation-name`.
3. In `skills/visual-craft/SKILL.md`, say a success state may use a catalog success component such as confetti. A Lottie file is downloaded only when the user asks for an illustration. The plan expected a Lottie here; the skill left that lane closed.
4. In `skills/visual-craft/catalog.yaml`, replace or relabel `empty-field`. It is a form field, not an empty state.
