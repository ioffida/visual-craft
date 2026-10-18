import assert from "node:assert/strict"
import test from "node:test"
import { startHttp } from "../src/http.js"

test("HTTP listener answers health and initialize", async () => {
  const listener = await startHttp({ port: 0 })
  try {
    const health = await fetch(`http://127.0.0.1:${listener.port}/health`)
    assert.equal(health.status, 200)
    assert.equal(await health.text(), "ok")

    const response = await fetch(listener.url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json, text/event-stream",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "initialize",
        params: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          clientInfo: { name: "visual-craft-http-test", version: "1.0.0" },
        },
      }),
    })
    assert.equal(response.status, 200)
    const body = await response.text()
    assert.match(body, /visual-craft/)
  } finally {
    await listener.close()
  }
})
