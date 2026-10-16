# Connect a product

`scripts/connect.mjs` installs the visual-craft bundle into a React + Tailwind product and records the free registries. It does not create `DESIGN.md`, change CSS, or run `shadcn init`.

## Command

From this repository:

```bash
node scripts/connect.mjs path/to/product
```

The product `package.json` must already depend on `tailwindcss` or `@tailwindcss/vite`.

## What it installs

Project skills for Cursor, under `.agents/skills/`:

- `landing-copy`
- `frontend-design`
- `shadcn`
- `web-design-guidelines`
- `review-animations`
- `visual-craft` (from `skills/visual-craft` in this repository)

Remote skills use `npx skills add <repo> --skill <name> -a cursor -y`. The local skill is added from its directory. If that command fails, the script copies `skills/visual-craft` to `.agents/skills/visual-craft`.

When `components.json` exists, these registry URLs are added without removing other keys:

- `@aceternity` → `https://ui.aceternity.com/registry/{name}.json`
- `@react-bits` → `https://reactbits.dev/r/{name}.json`
- `@magicui` → `https://magicui.design/r/{name}.json`

If `components.json` is missing, the script prints `npx shadcn@latest init` and leaves the product uninitialized.

## Undo

Delete `.agents/skills/` in the product, and remove the three registry keys from `components.json` if you added them only for this bundle. That does not remove components already installed into `src/`.
