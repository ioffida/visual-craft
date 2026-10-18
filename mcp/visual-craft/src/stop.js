import { spawnSync } from "node:child_process"
import { readFile, unlink } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const pidFile = resolve(dirname(fileURLToPath(import.meta.url)), "../visual-craft-mcp.pid")

let pidText
try {
  pidText = await readFile(pidFile, "utf8")
} catch {
  console.error("visual-craft MCP is not running.")
  process.exit(0)
}

const pid = Number(String(pidText).trim())
if (!Number.isInteger(pid) || pid <= 0) {
  console.error("visual-craft MCP pid file is unreadable.")
  process.exit(1)
}

if (process.platform === "win32") {
  spawnSync("taskkill", ["/PID", String(pid), "/F"], { stdio: "ignore" })
} else {
  try {
    process.kill(pid, "SIGTERM")
  } catch (error) {
    if (!(error instanceof Error) || error.code !== "ESRCH") throw error
  }
}

try {
  await unlink(pidFile)
} catch {
  // The listener may already have removed the pid file.
}

console.error("visual-craft MCP stopped.")
