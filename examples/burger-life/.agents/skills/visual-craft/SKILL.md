---
name: visual-craft
description: Routes UI requests to free registry installs and a license gate. Use when the user asks for a landing page, лендинг, visual polish, animation, icons, an auth or login screen, an empty state, or a theme, including the phrases "only the animation", "only icons", and "keep the current style".
---

# Visual craft

Install real source from [catalog.yaml](catalog.yaml). Do not recreate a component from memory. Do not open a lane the user closed.

## Stack

Continue only when the product is React and uses Tailwind. If either is missing, say so and stop before any install. Flutter and React Native are out of scope.

Registry installs need `components.json`. If it is missing, print `npx shadcn@latest init` and stop. Initializing that file does not restyle the app.

## Lanes

Start with every lane closed. Open a lane from the user's words first. On a selling page, if the user left a lane unspecified, use the page job from the `landing-copy` skill.

| Lane | Open | Closed by |
| --- | --- | --- |
| Style | "make it look like…", a new marketing page, or no theme yet | "keep the current style", "only the animation", "only icons" |
| Structure | a screen, named block, form, dialog, or missing control | "only the animation", "only the style", or the block already exists |
| Motion | an action needs feedback, or a selling page needs one memorable moment | "no animation", or the request never mentions motion or a page |
| Icons | the user asks, or a new control has an empty icon slot | an icon set is already chosen and the user did not ask to replace it |
| Illustration | an animated illustration, or a success scene a component cannot carry | anything else |

Page job, only for lanes the user did not specify:

| Page job | Style | Structure | Motion |
| --- | --- | --- | --- |
| Category introduction, campaign | Open. One `DESIGN.md`. | Open for sections being built | One viewport effect |
| Product selection, pricing, feature evaluation | Open only if no theme yet | Open for sections being built | Feedback only |
| Daily product UI | Closed when a theme exists | Match components already in the repo | Feedback on occasional actions |

Explicit words win. "Only the animation" opens Motion and leaves Style and Structure closed.

## Order

1. List the open lanes in one sentence.
2. For a named block, follow [blocks.md](blocks.md) and stop that lane there.
3. For every other open lane, pick a record in [catalog.yaml](catalog.yaml) whose `role` matches. If none fits, `npx shadcn@latest search` the configured registries.
4. Read [license-gate.md](license-gate.md) and refuse the record if it fails.
5. Run the record's `install` command with the project's package runner (`npx`, `pnpm dlx`, or `bunx`). `procedure` records have no command: follow `when` and `limits`.
6. Apply motion from [motion.md](motion.md) only when Motion is open.
7. Style lane only: one `DESIGN.md`, plus one `theme` record when tokens should change. Do not copy logos.
8. Offer `web-design-guidelines` and `review-animations` on the files that changed.

## Report

End with the open lanes, each install command that ran, and the catalog id it came from. Closed lanes are listed as untouched.
