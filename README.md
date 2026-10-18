# Visual Craft GTR

[Русский](README.ru.md)

![Visual Craft](assets/cover.png)

An external MCP server and a rule pack for Cursor. In a React and Tailwind project, Cursor installs real free components from a catalog. The server does not write files into that project.

## What you can ask

Each line is its own request. The words decide how much of the page changes. Cursor installs the component. The server only names it.

- **A whole landing.** Ask for a landing page. Visual Craft builds it from the free catalog: navigation, a first screen, prices you stated, questions and answers, and a footer made of your links. One theme and one design file.
- **An animated landing.** Name the motion. A background, a headline effect, and a second animation are built. A quieter page is only a suggestion.
- **A button.** Ask to rework only this button. That control is replaced. The rest of the page stays.
- **Button animation.** Ask for only the animation on this button. Press, error, and success sit on that control. The page style stays.
- **A style of its own.** Ask for only the style. One design file and one theme. The sections stay where they are.
- **Keep the current style.** A new screen uses the theme already in the project.
- **A sign-in screen.** A catalog login block, with press, error, and success. The form is not redrawn from memory.
- **A background.** Beams, particles, or aurora, when you name that kind of background.
- **Headline motion.** A masked heading, blurred text, or text that appears, when you name the headline.
- **Icons.** Lucide, in empty slots of controls just added, or when you ask for icons only.
- **A QR code.** Built in the project when you ask for one. A missing catalog record is not a refusal.
- **One illustration.** A single Lottie file whose page states the Simple License, saved with a credits file.
- **An empty screen.** A catalog empty state that invites the next action.
- **A success moment.** A check when an item first enters a cart, or confetti when a signup succeeds.
- **A shop, a catalog, or a one-page tool.** The same visual rule as a landing. Naming an effect is enough. The kind of product does not cancel it.
- **No animation.** Say so, and motion stays closed.

A paid registry, someone else's logo, Icons8, and a bulk Lottie download stay a refusal.

## Phrases

- A whole page: `Use Visual Craft. Make this a landing page.`
- Only a button: `Use Visual Craft. Only this button.`
- Only animation: `Use Visual Craft. Only the animation on this button.`
- Only the style: `Use Visual Craft. Only the style.`

## How it works

The running server says what to install. The pack says where it goes. The person's request wins over taste: a named background, a second animation, or a QR code is built. A license failure, someone else's logo, or a paid registry is still a refusal.

`examples/burger-life` is a trial landing kept in this repository. `examples/gate-pass` is a one-page tool with a background, a button animation, and a QR code. Neither file is the setup guide.

## First message

In a new project:

> Use Visual Craft for this design. Also use the pack at `<path-to-clone>/pack/visual-craft`.

## Later messages

> Use Visual Craft.

Repeat the pack path only if you have not run `install-visual-craft.bat` once on that project.

## Run

From `mcp/visual-craft`, run `npm start`. Stop with `npm run stop`. The listener is `http://127.0.0.1:3847/mcp`. On Windows, `start-visual-craft-mcp.bat` and `stop-visual-craft-mcp.bat` call those same commands.

Add this inside `mcpServers` in `%USERPROFILE%\.cursor\mcp.json` (on macOS and Linux, `~/.cursor/mcp.json`):

```json
"visual-craft": {
  "url": "http://127.0.0.1:3847/mcp"
}
```

Reload MCP servers in Cursor. The project must already use React and Tailwind.

## Sources

Only the free tier of each site is used.

- [shadcn/ui](https://ui.shadcn.com)
- [Magic UI](https://magicui.design), free components
- [Aceternity UI](https://ui.aceternity.com), free components
- [React Bits](https://reactbits.dev), free TypeScript and Tailwind entries
- [Luxe](https://www.luxeui.com)
- [tweakcn](https://tweakcn.com), theme tokens
- [Lucide](https://lucide.dev)
- [LottieFiles](https://lottiefiles.com), one file whose page states the Lottie Simple License
- [Hover.dev](https://www.hover.dev), only a page marked Free
- [awesome-design-md](https://github.com/voltagent/awesome-design-md), mood only, no logos

Pro registries, the Refero MCP, and Icons8 are not part of this bundle.

Skills from skills.sh that travel with the pack: `landing-copy`, `frontend-design`, `shadcn`, `web-design-guidelines`, `review-animations`.
