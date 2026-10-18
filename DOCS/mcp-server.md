# Visual craft MCP server

The server is a separate process. Cursor starts it from the user-level MCP config. It does not copy skills, catalog files, or `components.json` entries into the project that is open in chat.

The catalog and the lane rules stay in this repository. The server reads `skills/visual-craft/catalog.yaml` and answers tool calls. The model in the open project applies the answer by editing that project itself.

## Layout

```
mcp/visual-craft/
  package.json          # private package, own dependencies
  src/index.js          # tool registration; stdio entry used by tests
  src/http.js           # localhost listener on 127.0.0.1:3847
  src/catalog.js        # reads the shared catalog
  src/license.js        # the license gate
  src/plan.js           # lanes, theme, effect, and block picks
  src/check.js          # read-only visual check
  test/logic.test.js
  test/stdio.test.js
```

Start it with:

```bash
node mcp/visual-craft/src/index.js
```

Cursor launches that command. A terminal session is not required. stdout is the protocol. Logs, if any, go to stderr.

## Tools

Every tool is read-only. `writesFiles` in each response is `false`.

| Name | Title in Cursor | What it returns |
| --- | --- | --- |
| `apply-style` | Применить стиль | Which lanes open from the user's words, the free catalog records to install, and the motion limits. Stops when the project is not React + Tailwind, when `components.json` is missing, or when the request asks for a Pro, Icons8, Refero, or bulk download. |
| `check-visual` | Проверить визуал | Pass or fail for lane discipline, Pro and Icons8 packages, reduced motion, auth press scale, a redrawn sign-in file, and Lottie count. |
| `find-component` | Найти компонент | Catalog records for a role or a few words: install command, registry URL, and limits. |
| `check-license` | Проверить лицензию | Allow or refuse one id, command, or URL before an install or a download. |

`apply-style` and `check-visual` accept `project_root` so they can read the open project. They do not create or edit that path.

Lane words match the tested skill. "Only the animation" and "только анимацию" open Motion and leave Style closed. A selling page opens Style, Structure, and one viewport effect. An auth request on an existing theme picks `auth-login-01` and does not pick a new theme.

## Run

From the repository root:

- `start-visual-craft-mcp.bat` starts the server on `127.0.0.1:3847` and writes `mcp/visual-craft/visual-craft-mcp.pid`.
- `stop-visual-craft-mcp.bat` stops that process.

The listener stays up until the stop script runs. Cursor does not launch it.

## Connect

Add this object inside `mcpServers` in `%USERPROFILE%\.cursor\mcp.json`. Do not put that file in a product repository. In Cursor: Settings, MCP, then reload.

```json
"visual-craft": {
  "url": "http://127.0.0.1:3847/mcp"
}
```

The start script must be running before Cursor calls a tool. One entry applies to every project opened in Cursor.

`scripts/connect.mjs` copies skills into `.agents/skills/`. Use this MCP entry when the project should stay free of those files.

## In chat

The user writes a normal request. Cursor shows the tool by its title and sends the arguments. The server answers with a plan. The model then edits the open project.

1. User: "Сделай продающий лендинг."
2. Cursor calls **Применить стиль** (`apply-style`) with that sentence and the open project's path.
3. The reply lists open lanes, `theme-modern-minimal`, `hero-spotlight`, and the motion limits. It does not write `DESIGN.md`.
4. The model installs those records in the project and writes the page.
5. User: "Проверь визуал."
6. Cursor calls **Проверить визуал** (`check-visual`). A closed style lane with `DESIGN.md` in the diff fails. `@magicui-pro` in `package.json` fails.

A request such as "поставь @magicui-pro/hero-1" or "скачай 30 анимаций" stops in **Проверить лицензию** (`check-license`) before a download.
