import { createServer } from "node:http"
import { realpathSync, unlinkSync, writeFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath, pathToFileURL } from "node:url"
import {
  localhostHostValidation,
  localhostOriginValidation,
  NodeStreamableHTTPServerTransport,
} from "@modelcontextprotocol/node"
import { createServer as createMcpServer } from "./index.js"

export const HOST = "127.0.0.1"
export const PORT = 3847

const here = dirname(fileURLToPath(import.meta.url))
const defaultPidFile = resolve(here, "../visual-craft-mcp.pid")

const validateHost = localhostHostValidation()
const validateOrigin = localhostOriginValidation()

export function startHttp({ port = PORT, host = HOST, pidFile = null } = {}) {
  const http = createServer(async (req, res) => {
    const pathname = new URL(req.url ?? "/", "http://127.0.0.1").pathname
    if (pathname === "/health") {
      res.writeHead(200, { "content-type": "text/plain; charset=utf-8" })
      res.end("ok")
      return
    }
    if (pathname !== "/mcp") {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" })
      res.end("not found")
      return
    }
    if (!validateHost(req, res) || !validateOrigin(req, res)) return

    const mcp = createMcpServer()
    const transport = new NodeStreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    res.on("close", () => {
      Promise.resolve(transport.close()).catch(() => {})
      Promise.resolve(mcp.close()).catch(() => {})
    })
    try {
      await mcp.connect(transport)
      await transport.handleRequest(req, res)
    } catch (error) {
      console.error(error instanceof Error ? error.message : error)
      if (!res.headersSent) {
        res.writeHead(500, { "content-type": "text/plain; charset=utf-8" })
      }
      res.end()
    }
  })

  return new Promise((resolveListen, rejectListen) => {
    http.once("error", rejectListen)
    http.listen(port, host, () => {
      http.removeListener("error", rejectListen)
      const address = http.address()
      const listeningPort = typeof address === "object" && address ? address.port : port
      if (pidFile) writeFileSync(pidFile, `${process.pid}\n`)
      resolveListen({
        port: listeningPort,
        url: `http://${host}:${listeningPort}/mcp`,
        close: () =>
          new Promise((resolveClose, rejectClose) => {
            if (pidFile) {
              try {
                unlinkSync(pidFile)
              } catch {
                // The stop script may already have removed the pid file.
              }
            }
            http.close((error) => (error ? rejectClose(error) : resolveClose()))
          }),
      })
    })
  })
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
  const listener = await startHttp({ pidFile: defaultPidFile })
  console.error(`visual-craft MCP is listening at ${listener.url}`)
  const stop = () => {
    listener.close().then(
      () => process.exit(0),
      () => process.exit(1),
    )
  }
  process.on("SIGINT", stop)
  process.on("SIGTERM", stop)
}
