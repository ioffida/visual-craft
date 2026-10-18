# Connect a product

`scripts/connect.mjs` installs the visual-craft bundle into a React + Tailwind product and records the free registries. It does not create `DESIGN.md`, change CSS, or run `shadcn init`.

## Command

Double-click `install-visual-craft.bat` in this repository, then paste the product folder path or drop that folder onto the bat file. The same install from a terminal:

```bash
node scripts/connect.mjs path/to/product
```

The product `package.json` must already depend on `tailwindcss` or `@tailwindcss/vite`. The visual-craft MCP server stays in the user Cursor config. This command only fills the product.

## What it installs

Project skills for Cursor, under `.agents/skills/`:

- `landing-copy`
- `frontend-design`
- `shadcn`
- `web-design-guidelines`
- `review-animations`
- `visual-craft` (from `skills/visual-craft` in this repository)

It also writes `.cursor/rules/visual-craft.mdc`. That rule tells Cursor, in this product, to call the visual-craft MCP tools and to follow the skills listed above.

Remote skills use `npx skills add <repo> --skill <name> -a cursor -y`. The local skill is added from its directory. If that command fails, the script copies `skills/visual-craft` to `.agents/skills/visual-craft`.

When `components.json` exists, these registry URLs are added without removing other keys:

- `@aceternity` → `https://ui.aceternity.com/registry/{name}.json`
- `@react-bits` → `https://reactbits.dev/r/{name}.json`
- `@magicui` → `https://magicui.design/r/{name}.json`

If `components.json` is missing, the script prints `npx shadcn@latest init` and leaves the product uninitialized.

## Undo

Delete `.agents/skills/` and `.cursor/rules/visual-craft.mdc` in the product, and remove the three registry keys from `components.json` if you added them only for this bundle. That does not remove components already installed into `src/`.
