import { realpathSync } from "node:fs"
import { pathToFileURL } from "node:url"
import { McpServer } from "@modelcontextprotocol/server"
import { serveStdio } from "@modelcontextprotocol/server/stdio"
import * as z from "zod/v4"
import { loadCatalog, publicRecord, searchCatalog } from "./catalog.js"
import { checkVisual } from "./check.js"
import { checkLicense } from "./license.js"
import { planStyle } from "./plan.js"

const pageJob = z.enum(["category_introduction", "product_selection", "daily_ui"]).optional()
const tone = z.enum(["consumer", "neutral", "developer"]).optional()

const readOnly = {
  readOnlyHint: true,
  destructiveHint: false,
  openWorldHint: false,
}

export function createServer() {
  const server = new McpServer({ name: "visual-craft", version: "1.0.0" })

  server.registerTool(
    "apply-style",
    {
      title: "Применить стиль",
      description:
        "Применить стиль. Call this before building or restyling a React + Tailwind page. Returns which visual lanes open, which free catalog record to install, and the motion limits. Does not write files.",
      inputSchema: z.object({
        request: z.string().describe("The user's words, in Russian or English."),
        project_root: z.string().optional().describe("Absolute path of the open project. Read only."),
        page_job: pageJob,
        tone,
        has_theme: z.boolean().optional(),
        block_exists: z.boolean().optional(),
        icon_library_set: z.boolean().optional(),
      }),
      annotations: readOnly,
    },
    async (args) =>
      reply(
        await planStyle(
          {
            request: args.request,
            projectRoot: args.project_root,
            pageJob: args.page_job,
            tone: args.tone,
            hasTheme: args.has_theme,
            blockExists: args.block_exists,
            iconLibrarySet: args.icon_library_set,
          },
          await loadCatalog(),
        ),
      ),
  )

  server.registerTool(
    "check-visual",
    {
      title: "Проверить визуал",
      description:
        "Проверить визуал. Call this after a visual change. Checks lane discipline, Pro and Icons8 packages, reduced motion, auth press scale, a redrawn login block, and Lottie count. Reads the project when project_root is passed. Does not write files.",
      inputSchema: z.object({
        request: z.string().describe("The request that opened the lanes."),
        project_root: z.string().optional(),
        files_changed: z.array(z.string()).optional(),
        page_job: pageJob,
        has_theme: z.boolean().optional(),
        block_exists: z.boolean().optional(),
        icon_library_set: z.boolean().optional(),
      }),
      annotations: readOnly,
    },
    async (args) =>
      reply(
        await checkVisual({
          request: args.request,
          projectRoot: args.project_root,
          filesChanged: args.files_changed,
          pageJob: args.page_job,
          hasTheme: args.has_theme,
          blockExists: args.block_exists,
          iconLibrarySet: args.icon_library_set,
        }),
      ),
  )

  server.registerTool(
    "find-component",
    {
      title: "Найти компонент",
      description:
        "Найти компонент. Call this to see where a free hero, auth block, button, theme, or other catalog role comes from. Returns install commands and limits. Does not install or write files.",
      inputSchema: z.object({
        role: z
          .enum([
            "auth",
            "button",
            "hero",
            "background",
            "text",
            "card",
            "empty",
            "success",
            "icon",
            "theme",
            "lottie",
          ])
          .optional(),
        query: z.string().optional(),
      }),
      annotations: readOnly,
    },
    async ({ role, query }) => {
      const items = await loadCatalog()
      const matches = searchCatalog(items, { role, query }).map(publicRecord)
      return reply({ writesFiles: false, matches })
    },
  )

  server.registerTool(
    "check-license",
    {
      title: "Проверить лицензию",
      description:
        "Проверить лицензию. Call this before every install or download. Refuses Pro registries, Icons8, Refero, unpaid Hover, Aceternity blocks and templates, premium Lottie, and bulk downloads. Does not download anything.",
      inputSchema: z.object({
        candidate: z.string().describe("Catalog id, install command, URL, or the user's download request."),
        lottie_count: z.number().int().nonnegative().optional(),
        user_marked_free: z.boolean().optional(),
      }),
      annotations: readOnly,
    },
    async ({ candidate, lottie_count, user_marked_free }) =>
      reply({
        writesFiles: false,
        ...checkLicense(candidate, {
          lottieCount: lottie_count,
          userMarkedFree: user_marked_free,
        }),
      }),
  )

  return server
}

function reply(value) {
  return {
    content: [{ type: "text", text: JSON.stringify(value, null, 2) }],
    structuredContent: value,
  }
}

function invokedDirectly() {
  const entry = process.argv[1]
  if (!entry) return false
  try {
    return import.meta.url === pathToFileURL(realpathSync(entry)).href
  } catch {
    return false
  }
}

if (invokedDirectly()) {
  serveStdio(() => createServer())
}
