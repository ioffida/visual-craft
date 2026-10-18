import assert from "node:assert/strict"
import { spawn } from "node:child_process"
import { once } from "node:events"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const serverPath = resolve(dirname(fileURLToPath(import.meta.url)), "../src/index.js")

test("stdio server lists the four tools and refuses a pro install", async () => {
  const child = spawn(process.execPath, [serverPath], { stdio: ["pipe", "pipe", "pipe"] })
  const killer = setTimeout(() => child.kill(), 8000)
  try {
    const messages = readMessages(child.stdout)
    send(child, {
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        clientInfo: { name: "visual-craft-test", version: "1.0.0" },
      },
    })
    const initialized = (await messages.next()).value
    assert.equal(initialized.id, 1)
    assert.equal(initialized.error, undefined)

    send(child, { jsonrpc: "2.0", method: "notifications/initialized" })
    send(child, { jsonrpc: "2.0", id: 2, method: "tools/list", params: {} })
    const listed = (await messages.next()).value
    const names = listed.result.tools.map((tool) => tool.name).sort()
    assert.deepEqual(names, ["apply-style", "check-license", "check-visual", "find-component"])
    assert.ok(listed.result.tools.every((tool) => tool.annotations.readOnlyHint === true))

    send(child, {
      jsonrpc: "2.0",
      id: 3,
      method: "tools/call",
      params: { name: "check-license", arguments: { candidate: "@magicui-pro/hero-1" } },
    })
    const called = (await messages.next()).value
    const body = JSON.parse(called.result.content[0].text)
    assert.equal(body.allowed, false)
    assert.equal(body.writesFiles, false)
  } finally {
    clearTimeout(killer)
    child.kill()
    await once(child, "exit")
  }
})

function send(child, message) {
  child.stdin.write(`${JSON.stringify(message)}\n`)
}

async function* readMessages(stdout) {
  let buffer = ""
  const chunks = []
  let waiting
  let ended = false
  stdout.setEncoding("utf8")
  stdout.on("data", (chunk) => {
    chunks.push(chunk)
    if (waiting) {
      waiting()
      waiting = null
    }
  })
  stdout.on("end", () => {
    ended = true
    if (waiting) {
      waiting()
      waiting = null
    }
  })
  while (!ended || buffer.includes("\n") || chunks.length > 0) {
    const newline = buffer.indexOf("\n")
    if (newline !== -1) {
      const line = buffer.slice(0, newline).replace(/\r$/, "").trim()
      buffer = buffer.slice(newline + 1)
      if (line) yield JSON.parse(line)
      continue
    }
    if (chunks.length === 0) {
      if (ended) return
      await new Promise((resolveWait) => {
        waiting = resolveWait
      })
      continue
    }
    buffer += chunks.splice(0).join("")
  }
}
