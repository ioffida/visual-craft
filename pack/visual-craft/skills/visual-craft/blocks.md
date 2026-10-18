# Blocks

A named product block (auth, pricing, settings, empty) is not a separate skill. Find a real implementation, install it, fit it, then animate its actions.

1. Look up the role in [catalog.yaml](catalog.yaml). Auth defaults to `auth-login-01` (`npx shadcn@latest add login-01`). Nav defaults to `nav-floating`. Pricing defaults to `pricing-cards` plus `card-shadcn`. FAQ defaults to `faq-accordion`. Footer defaults to `footer-links`.
2. If the catalog has no record, run `npx shadcn@latest search` across the configured registries. Read the item docs before writing markup.
3. Pass the chosen record through [license-gate.md](license-gate.md). Then run its `install` command. The CLI resolves the project's style.
4. Fit the installed block to the open style lane. Spacing, radius, type, and color come from the current theme and, when the style lane is open, from `DESIGN.md`. Do not redraw the form.
5. Add the motion in [motion.md](motion.md) for this block's actions. On auth that is press on submit, a visible error, and a success state. Focus between fields stays immediate. A marketing auth page may also have one entrance on the card.

An effect may sit beside the block as the one viewport moment or the success illustration. It does not replace the form. A decorative card with no labels, errors, or keyboard path is not an auth block.
