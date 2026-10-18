# Visual Craft pack

Read this file first when the user says to use Visual Craft and to use this pack. The user's request is the brief. Build every thing they named. Taste rules, including `frontend-design` and `review-animations`, may recommend a quieter page after the build. They do not cancel the brief.

The MCP server names a real free component when the catalog has one. A product feature the catalog does not list, such as a QR code, is built in the project. Do not copy this pack into the project. Do not redraw a catalog block from memory.

## Order

1. Call the visual-craft MCP tool `apply-style` with the user's words and this project's root.
2. Obey the lanes in that reply. A closed lane is not touched.
3. Read the skill below that matches the open lane, then edit the existing page.
4. Call `check-license` before every install or download. Call `find-component` when the reply has no record for a role.
5. Run the install command in this project. Fit spacing, type, and color to the open style. Leave the installed markup in place.
6. After any visual edit in this chat, call `check-visual` before the reply. Do not wait for a separate request. Then review the edited files with `skills/web-design-guidelines/SKILL.md` and, if motion changed, `skills/review-animations/SKILL.md`.

## Where each piece goes

| Open lane | Skill to read | Where it lands |
| --- | --- | --- |
| Style | `skills/landing-copy/SKILL.md`, then `skills/frontend-design/SKILL.md` | One `DESIGN.md` at the project root. One theme install in the existing CSS entry. The page already on screen keeps its sections. |
| Structure | `skills/shadcn/SKILL.md` and `skills/visual-craft/blocks.md` | The registry block replaces the matching section or route. A sign-in block replaces the sign-in screen. A card replaces that card. The form is not redrawn. |
| Motion | `skills/visual-craft/motion.md`, then `skills/review-animations/SKILL.md` | Build the motion they named, including a background and any extra animation. A shop, a catalog, a landing page, and a one-page tool all qualify. Press, error, and success sit on the control that performs that action. Recommending one first-screen effect is advice, not a cap. A request that only names a control does not add a first-screen effect they did not ask for. |
| Icons | `skills/visual-craft/catalog.yaml` role `icon` | The icon set already named in `components.json`. Empty icon slots in the controls just added. |
| Illustration | `skills/visual-craft/license-gate.md` | A picture, scene, or QR they asked for. A downloaded Lottie file goes in `public/animations/` with `public/animations/CREDITS.md`. |

## Existing visual

The project may already have a design. Use it when the style lane is closed. When the style lane is open, change tokens and `DESIGN.md`, then put new components into the sections that are already there. Do not add a second page shell beside the current one.

## Skills in this pack

- `skills/landing-copy/` — audience, claim, and page job before a selling page is restyled.
- `skills/frontend-design/` — one deliberate visual direction. A pinned `DESIGN.md` wins.
- `skills/shadcn/` — install and compose registry components in the existing project.
- `skills/visual-craft/` — lanes, catalog, license gate, motion, and named blocks.
- `skills/web-design-guidelines/` — interface review after the edit.
- `skills/review-animations/` — motion review after the edit.
