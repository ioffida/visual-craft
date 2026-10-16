# Source audit

Date: 2026-10-16

Each link from the original list is judged on three questions: how an agent obtains real code, whether commercial use of an end product is free, and whether the source belongs in the automatic catalog.

Verdicts:

- **Catalog** — the agent may install this in a product, within the limits below.
- **Inspiration** — the agent may read a style direction, then implement with catalog sources.
- **Conditional** — allowed only when a stated extra condition is true.
- **Exclude** — paid, wrong stack, or unsafe to automate.

The catalog stores install commands and license notes. It does not vendor component source or animation files.

## Summary

| Source | Access | Commercial use | Verdict |
| --- | --- | --- | --- |
| shadcn/ui | `npx shadcn@latest add` and shadcn MCP | MIT, yes | Catalog, foundation |
| Magic UI free | `@magicui/{name}` | MIT, yes | Catalog, effects |
| React Bits free | `@react-bits/{Name}-TS-TW` | MIT + Commons Clause, yes in an end product | Catalog, effects |
| Aceternity free components | `@aceternity/{name}` | Free for end products; no redistribution as a library | Catalog, effects only |
| Luxe | `npx luxe add` | MIT, yes | Catalog, small accent set |
| tweakcn | `npx shadcn@latest add https://tweakcn.com/r/themes/{id}.json` | Editor is Apache-2.0; themes are meant to be installed | Catalog, theme tokens |
| awesome-design-md | Copy one `DESIGN.md` | Repo is MIT; brand identities stay with their owners | Inspiration |
| Refero Styles | Human browse; live MCP is paid | MCP requires Pro, Team, or Lifetime | Inspiration in the browser; exclude the MCP |
| Hover.dev | Copy from a page | Free items: yes. Unmarked items: Hover Pro | Conditional, manual only |
| LottieFiles Free | Download one file after checking that page | Lottie Simple License, yes | Conditional, one file per request |
| Icons8 Flutter and Dart | Download from the site | Free account requires visible credit links | Exclude for v1 |
| Lucide (replacement) | shadcn default icon library | ISC, yes | Catalog, default icons |

## shadcn/ui

- URL: https://ui.shadcn.com/docs/components/
- What it is: accessible React components distributed as source. Buttons, forms, dialogs, cards, empty states, and the rest of the product shell.
- Access: `npx shadcn@latest add {name}` after `npx shadcn@latest init`. Search with `npx shadcn@latest search`. Official MCP: `npx shadcn@latest mcp`, configured in the product as `.cursor/mcp.json` with command `npx` and args `shadcn@latest mcp`. Registries live in `components.json`. Docs: https://ui.shadcn.com/docs/mcp
- License: MIT (https://github.com/shadcn-ui/ui).
- Verdict: **Catalog, foundation.** Every product screen starts here. Effect libraries sit on top.
- Limits: run the project's package runner (`npx`, `pnpm dlx`, or `bunx`). Read `npx shadcn@latest info --json` before writing component code. Use semantic colors (`bg-primary`), `gap-*` for stacks, and the icon library recorded in `components.json`.

## Magic UI

- URL: https://magicui.design/
- What it is: animated React components (marquees, beams, globes, text effects) that install into a shadcn project.
- Access: `npx shadcn@latest add @magicui/marquee`. Registry pattern used by the project: `https://magicui.design/r/{name}`. Installation docs: https://magicui.design/docs/installation
- License: MIT (https://github.com/magicuidesign/magicui). Attribution is not required.
- Verdict: **Catalog, effects.**
- Limits: `@magicui-pro` and https://pro.magicui.design are paid. The agent installs only the public `@magicui` namespace. A separate Magic UI MCP exists; v1 uses the shadcn CLI and shadcn MCP against this registry instead of a second server.

## React Bits

- URLs: https://reactbits.dev/ and https://reactbits.dev/get-started/index
- What it is: animated text, backgrounds, and micro-interactions. The second URL is the component index of the same library. Each component has four flavors: `JS-CSS`, `JS-TW`, `TS-CSS`, `TS-TW`.
- Access: `npx shadcn@latest add @react-bits/SplitText-TS-TW`. Registry URL: `https://reactbits.dev/r/{name}.json`. MCP path documented by the project is the shadcn MCP plus that registry in `components.json`. Docs: https://reactbits.dev/get-started/installation and https://reactbits.dev/get-started/mcp
- License: MIT + Commons Clause (https://github.com/DavidHDev/react-bits/blob/main/LICENSE.md). Use inside an application, website, or product is allowed, including commercial products. Selling, sublicensing, or redistributing the components themselves is not allowed. The copyright notice stays with substantial copies.
- Verdict: **Catalog, effects.** Default flavor for this system is `TS-TW`.
- Limits: https://pro.reactbits.dev is a separate paid product. Do not point the agent at the Pro registry.

## Aceternity UI

- URL: https://ui.aceternity.com/
- What it is: animated React components built with Tailwind and Motion. The site also sells blocks, landing sections, and full templates.
- Access for free components: add this to `components.json`:

```json
{
  "registries": {
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json"
  }
}
```

Then `npx shadcn@latest add @aceternity/3d-marquee`. Direct URL form: `npx shadcn@latest add https://ui.aceternity.com/registry/{name}.json`. CLI notes: https://ui.aceternity.com/docs/cli

- License: the project states that free components may be used in unlimited personal and commercial end products, and that the component source may not be resold or redistributed as a competing library or template marketplace. Full terms: https://ui.aceternity.com/licence
- Verdict: **Catalog, free components only.**
- Limits: blocks, full landing pages, and templates require All-Access (pricing page https://ui.aceternity.com/pricing). The machine-readable list at https://ui.aceternity.com/ai-recommendations mixes free and pro items. A catalog entry must name a free component. If the install URL or page is marked Pro, Block, or Template, the agent stops.

## Luxe

- URL: https://www.luxeui.com/
- What it is: a small MIT React set (Radix, Tailwind v4, Motion). Version 2 reduced the library to a short list of components with visual variants, including button treatments such as shine and magnetic.
- Access: `npx luxe init`, then `npx luxe add {component}`. This is Luxe's own CLI, not `npx shadcn add`. Docs: https://luxeui.com/ui/installation
- License: MIT (https://github.com/guhrodrrigues/luxe).
- Verdict: **Catalog, accent set.** Use it when a shadcn control needs a stronger visual variant and a Luxe component already exists. Keep shadcn as the base for forms, dialogs, and layout.
- Limits: the CLI is still described by the project as evolving. At implementation time, confirm the current `add` command against the docs before writing it into the skill.

## tweakcn

- URL: https://tweakcn.com/
- What it is: a visual theme editor for shadcn/ui. Output is CSS variables, not page sections.
- Access: built-in and shared themes install through the shadcn registry. Documented URL shape: `https://tweakcn.com/r/themes/{id}.json` (the `.json` suffix is optional). Example built-in id used by the project: `zinc`. Human share links look like `https://tweakcn.com/themes/{id}`.
- License: the editor repository is Apache-2.0 (https://github.com/jnsahaj/tweakcn). Installing a theme into an app is the product's purpose.
- Verdict: **Catalog, theme tokens.**
- Limits: do not copy the tweakcn application into a product. Prefer a short allowlist of built-in theme ids in the future catalog. A user-published theme is installed only when the user supplies its id or URL.

## awesome-design-md

- URL: https://github.com/voltagent/awesome-design-md
- What it is: a curated set of `DESIGN.md` files in the Google Stitch format. Each file records mood, color roles, type, components, layout, elevation, and do/don't rules extracted from a public website. Files are also published at https://getdesign.md/{site}/design-md
- Access: copy one `DESIGN.md` into the product root and tell the agent to follow it. There is no component registry.
- License: the collection repository is MIT. The README states that the files are extracted design tokens from public CSS, and that the project does not own those sites' visual identities.
- Verdict: **Inspiration.** One file per product, chosen to match the brief. It is a style brief for shadcn, tweakcn, and effect components.
- Limits: do not copy logos, wordmarks, product photography, or proprietary font files. Do not present the result as an official page of the referenced brand. If the brief names a brand ("like Linear"), use that brand's `DESIGN.md` as the token brief and keep the product's own name and content.

## Refero Styles

- URL: https://styles.refero.design/
- What it is: a public gallery of AI-readable style writeups taken from real marketing and product sites. A full style can include color roles, type, spacing, and do/don't notes.
- Access for a person: open the site and pick a mood. Access for an agent: Refero MCP at `https://api.refero.design/mcp` (`refero_search_styles`, `refero_get_style`). Setup: https://doc.refero.design/mcp/getting-started
- License and price: the Free plan can browse limited results. Refero MCP, the Figma plugin, and live research require Pro, Team, or Lifetime (https://doc.refero.design/help/plans). Standard paid MCP use is for the subscriber's own product design, with a monthly call cap, and is not a license to republish the catalog.
- Verdict: **Inspiration in the browser. Exclude the MCP** from the free system. The free substitute for "pick a mood" is one file from awesome-design-md.
- Limits: if a paid Refero account is added later, it is an optional research layer. It does not replace the install commands in this audit.

## Hover.dev

- URL: https://www.hover.dev/components/buttons
- What it is: animated React and Tailwind components, especially buttons. Some cards are marked Free. The rest require Hover Pro.
- Access: copy the component source from the page. No shadcn registry was found.
- License: https://www.hover.dev/license says components marked Free need no account, and that commercial use, modification, and use without attribution are allowed. Compiling the library into a competing service is not allowed. Unmarked components require Hover Pro (https://www.hover.dev/pricing).
- Verdict: **Conditional, manual only.** Automatic install is out. When the user opens a specific Hover page and that page is marked Free, the agent may copy that one component into the product.
- Limits: do not crawl the site, do not cache a local mirror, and do not install a component whose page lacks the Free mark.

## LottieFiles Free

- URL: https://lottiefiles.com/free-animations/
- What it is: a search gallery of JSON and dotLottie animations.
- Access: open one animation page, confirm the license on that page, download that file into the product (for example `public/animations/`), and render it with `lottie-react` or `@lottiefiles/dotlottie-react`.
- License: public free animations use the Lottie Simple License (https://lottiefiles.com/page/license). Commercial use, modification, and display are allowed. Attribution is encouraged and not required. The license does not allow collecting the files to build a similar or competing service, and it does not allow redistributing the files as a standalone animation pack. Premium animations are a separate paid license. Some uploads can carry extra creator terms, so the agent checks the specific page.
- Verdict: **Conditional, one file per request.**
- Limits: this repository does not store a Lottie archive. The skill describes the check-and-download steps. The animation file lives only in the product that uses it.

## Icons8, Flutter and Dart set

- URL: https://icons8.ru/icons/set/flutter-and-dart
- What it is: an Icons8 icon set aimed at Flutter and Dart.
- Access: download from Icons8. There is no shadcn registry.
- License: the free account requires credit. Icons8's public guide asks for a link to icons8.com where the graphics are used (https://icons8.com/license). Their Universal Multimedia Licensing text for free account holders also requires the generated pair of links and restricts derivative copies. Paid plans remove that credit requirement.
- Verdict: **Exclude for v1.** The set targets Flutter, and the free web license adds a mandatory credit that the default icon path does not need.
- Replacement: Lucide, which shadcn selects by default. Lucide is ISC (https://github.com/lucide-icons/lucide). Commercial use does not require a footer credit. Icons8 is allowed later only when the user explicitly asks for it and the product shows the required credit.

## What the agent installs automatically

Allowed without a further question:

- shadcn/ui components
- `@magicui/*` public components
- `@react-bits/*-TS-TW` public components
- `@aceternity/*` components that the catalog has already marked free
- Luxe components through `npx luxe`
- a tweakcn theme from the allowlist, or a theme URL the user supplied
- Lucide icons through the shadcn icon setup

Allowed only with the extra check named above:

- one LottieFiles animation whose own page states the Lottie Simple License
- one Hover.dev component whose own page is marked Free, and only after the user points at that page

Never installed by this system:

- Magic UI Pro, React Bits Pro, Aceternity blocks and templates, Hover Pro
- Refero MCP
- a local mirror of LottieFiles or Icons8
- Icons8 assets, unless a later version adds an explicit credit path
