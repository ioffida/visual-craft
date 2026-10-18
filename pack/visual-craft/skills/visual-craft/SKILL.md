---
name: visual-craft
description: Routes UI requests to free registry installs and a license gate. Use when the user asks for a landing page, лендинг, visual polish, animation, icons, an auth or login screen, an empty state, or a theme, including the phrases "only the animation", "only icons", and "keep the current style".
---

# Visual craft

The user's request is the brief. Carry out every thing they named. A taste rule may recommend a quieter version, ask a question, or name a risk. It does not remove or postpone a named element.

Install a catalog record when one matches. A product feature the catalog does not list, such as a QR code, is built in the project. Do not redraw a catalog block from memory. Do not open a lane the user closed.

## Stack

Continue only when the product is React and uses Tailwind. If either is missing, say so and stop before any install. Flutter and React Native are out of scope.

Registry installs need `components.json`. If it is missing, print `npx shadcn@latest init` and stop. Initializing that file does not restyle the app.

## Lanes

Start with every lane closed. Open a lane from the user's words first. `landing-copy` names the audience and the claim. It does not set a visual ceiling.

| Lane | Open | Closed by |
| --- | --- | --- |
| Style | a design, a restyle, a site, or no theme yet | "keep the current style", "only the animation", "only icons" |
| Structure | a screen, named block, form, dialog, or missing control | "only the animation", "only the style", or the block already exists |
| Motion | an action needs feedback, or the user asked for a design or a visual | "no animation", or the request never mentions motion, a design, or a page |
| Icons | the user asks, or a new control has an empty icon slot | an icon set is already chosen and the user did not ask to replace it |
| Illustration | a picture, a scene, a QR code, or a success moment a component cannot carry | the user did not ask for one |

A pet shop, a technical catalog, a landing page, and a one-page tool follow the same visual rule. An existing screen stays open for a new piece the user names.

| User asked for | Style | Motion |
| --- | --- | --- |
| A page, a redesign, or anything they want seen | Open, unless they said to keep the current style. One `DESIGN.md`. | The motion they named. A first-screen effect is the default recommendation, not a cap. |
| Only a control or only the animation | Closed | Feedback on that control |
| Nothing visual, and a theme already exists | Closed | Feedback on the action they named |

Explicit words win. "Only the animation" opens Motion and leaves Style and Structure closed. Product type never cancels a named effect. One quiet page is a recommendation: named extras, including a background and a QR code, are built.

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
