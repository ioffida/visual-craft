# Skill shortlist

Date: 2026-10-16

The visual system is a thin router plus a catalog. This file is the install bundle. No skill from the list has been installed yet. The commands are what a product runs when it connects this repository.

Existing skills cover the selling brief, taste, accessibility review, and the shadcn CLI. They do not know the license gate or the source list in [source-audit.md](source-audit.md). Installing every design skill on skills.sh would put contradictory taste instructions in the same context.

Marketing skills on skills.sh write positioning and page copy. They do not choose an animation or a component library. One of them, `landing-copy`, is in the bundle because its page job tells the router which lanes to open. The mapping from that job to style and motion lives in [visual-craft-design.md](visual-craft-design.md), not inside the copy skill.

There is no auth skill, pricing skill, or other skill per screen. A request for a block is handled by the router: search the catalog and the registries, install that source, fit it to the open style, and add the motion that block's actions need.

Install commands use the skills CLI against the repository that actually contains the `SKILL.md`. Run them inside the product repository when that product should gain the skill.

## Install

### landing-copy

- Source: https://www.skills.sh/tushaarmehtaa/tushar-skills/landing-copy
- Install: `npx skills add https://github.com/tushaarmehtaa/tushar-skills --skill landing-copy`
- What it does: finds the audience, the alternative, the claim, and the page job before copy is written. Page jobs include category introduction, campaign response, product selection, pricing, and feature evaluation. It preserves an existing brand voice.
- Why it stays: this is the marketing input. The router turns the page job into open lanes (style, structure, motion). The skill itself does not install UI.
- Constraint: use it when the request is a selling page or a rewrite of selling copy. A request that only asks for an animation does not need a new positioning pass.

### shadcn

- Source: https://github.com/shadcn-ui/ui/blob/main/skills/shadcn/SKILL.md
- Install: `npx skills add https://github.com/shadcn-ui/ui --skill shadcn`
- What it does: project-aware component work. On load it runs `npx shadcn@latest info --json` and then searches, adds, and composes from registries. It already triggers when the task is to apply a `DESIGN.md` or brand spec onto shadcn/ui. Rules cover semantic colors, `Field` forms, icon slots (`data-icon`), empty states, and "search the registry before writing a custom control."
- Why it stays: this is the mechanism that installs a registry item when the structure lane or a registry effect is open. It does not force a shadcn restyle when those lanes are closed.
- Constraint: `user-invocable: false`. It applies when the task matches its description, which is what we want in a shadcn project. It allows `npx shadcn@latest`, `pnpm dlx shadcn@latest`, and `bunx --bun shadcn@latest`.

### frontend-design

- Source: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- Install: `npx skills add https://github.com/anthropics/skills --skill frontend-design`
- What it does: pushes the agent off generic generated layouts. It asks for a subject, a real type scale, one memorable hero, and a short token plan before code. It names common AI tells (cream and terracotta, acid green on black, identical cards, all-caps eyebrows) and says a pinned brief wins over those defaults.
- Why it stays: the router needs a taste pass so a shadcn page is not the unmodified default theme. Its own rule matches our architecture: when a `DESIGN.md` is present, that file is the brief.
- Constraint: one orchestrated entrance on a marketing page, plus motion that answers an action. It explicitly treats fade-and-slide on every section as a generic tell. That agrees with the motion rule in [visual-craft-design.md](visual-craft-design.md).

### web-design-guidelines

- Source: https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md
- Install: `npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines`
- What it does: a review pass. It fetches https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md and reports `file:line` findings for accessibility, interaction, and visual hygiene.
- Why it stays: it checks the result. It does not choose components or themes.
- Constraint: invoke it after a visual change, against the files that changed. It is not the build path.

### review-animations

- Source: https://github.com/emilkowalski/skills/blob/main/skills/review-animations/SKILL.md
- Install: `npx skills add https://github.com/emilkowalski/skills --skill review-animations`
- What it does: reviews motion code against a fixed bar. Justified motion, frequency, `ease-out`, durations under 300ms for UI, transform and opacity, `prefers-reduced-motion`, and no animation on keyboard shortcuts. Frontmatter sets `disable-model-invocation: true`, so it loads when named.
- Why it stays: the motion rule in the design doc is the build-time version of this bar. This skill is the check after the code exists.
- Constraint: it reviews; it does not pick a registry component. Its first response, if opened with no question, is a single readiness sentence. Invoke it with the files to review.

## Reject

### emil-design-eng

- Source: https://github.com/emilkowalski/skills/blob/main/skills/emil-design-eng/SKILL.md
- Why not: the useful rules (frequency, easing, press feedback, reduced motion) are already the standard inside `review-animations`, and the design doc copies the build-time subset into the router. This skill's opening instruction tells the agent to answer with one canned sentence and then wait, which fights a build task. Installing both Emil skills duplicates the same philosophy.

### delight, and the rest of impeccable

- Source: https://github.com/pbakaus/impeccable
- Why not: `delight` is one command inside a large suite (`bolder`, `quieter`, `overdrive`, `polish`, and others). The skill requires the parent impeccable flow and a context-gathering step before it will add micro-interactions. The suite also ships a launcher script. Those operators disagree with each other, and they disagree with a pinned `DESIGN.md`. Micro-interaction behavior is specified in the design doc instead.

### bolder, quieter, high-end-visual-design, ui-ux-pro-max

- Why not: skills.sh lists them as stylistic operators or broad taste packs. One product gets one `DESIGN.md`. A second taste skill in the same session will drift the palette, type, and density away from that file.

### Refero skill

- Source: https://github.com/referodesign/refero_skill
- Why not: live Refero research needs a paid plan. The free mood source is awesome-design-md. See the Refero section of [source-audit.md](source-audit.md).

## shadcn MCP, not a new server

Official docs: https://ui.shadcn.com/docs/mcp

In the product repository:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

Place that in `.cursor/mcp.json` and enable the server in Cursor. It browses and installs whatever registries `components.json` lists, including `@magicui`, `@react-bits`, and `@aceternity` once those URLs are configured.

Magic UI and Aceternity also document their own MCP servers. v1 does not add them. The shadcn server plus the registry URLs covers search and install. A second server would duplicate that path.

## How they sit together

1. On a selling page, `landing-copy` names the audience, the claim, and the page job.
2. `visual-craft` (not written yet) opens lanes from those words and from the page job. `frontend-design` and a `DESIGN.md` apply only when the style lane is open.
3. The `shadcn` skill, the shadcn CLI, or the shadcn MCP installs source for open lanes that use a registry.
4. `web-design-guidelines` and `review-animations` review the diff when asked.

Order of install in a product: `landing-copy`, `frontend-design`, `shadcn`, then the two review skills. The router skill is added when it exists.
