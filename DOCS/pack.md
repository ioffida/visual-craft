# Visual Craft pack

The pack is the folder `pack/visual-craft/`. It is handed to a chat by path. It is not copied into the product, and it does not replace the MCP config.

## What the user says

In the product chat, with the visual-craft MCP server already running:

> Use Visual Craft for the new design. Also use the pack at E:\Prejects\visual_creator_wf\pack\visual-craft.

The MCP server returns the catalog record and the install command. `PACK.md` tells the agent which skill to read and which existing section receives that install.

## Contents

- `PACK.md` — order of work and the placement table.
- `skills/landing-copy/`
- `skills/frontend-design/`
- `skills/shadcn/`
- `skills/visual-craft/`
- `skills/web-design-guidelines/`
- `skills/review-animations/`

`skills/visual-craft/` in the pack is a copy of `skills/visual-craft/` at the repository root. The other five folders are the skills.sh skills selected in `DOCS/skill-shortlist.md`.
