# Visual Craft

[Русский](README.ru.md)

![Visual Craft](assets/cover.png)

An external MCP server and a rule pack for Cursor. In a React and Tailwind project, Cursor installs real free components from a catalog. The server does not write files into that project.

## How it works

The running server says what to install. The pack says where it goes. The person's request wins over taste: a named background, a second animation, or a QR code is built. A license failure, someone else's logo, or a paid registry is still a refusal.

`examples/burger-life` is a trial landing kept in this repository. It is not the setup guide.

## First message

In a new project:

> Use Visual Craft for this design. Also use the pack at `<path-to-clone>/pack/visual-craft`.

## Later messages

> Use Visual Craft.

Repeat the pack path only if you have not run `install-visual-craft.bat` once on that project.

## Run

Start `start-visual-craft-mcp.bat`. Stop with `stop-visual-craft-mcp.bat`. On another system, `node mcp/visual-craft/src/http.js` listens on the same address.

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
