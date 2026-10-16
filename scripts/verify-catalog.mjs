import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { parse } from "yaml"

const catalogPath = resolve("skills/visual-craft/catalog.yaml")
const required = ["id", "role", "source", "tier", "license", "install", "when", "limits"]

function isProReference(value) {
  return /magicui-pro|react-?bits-pro|@(?:[\w-]+-)?pro\b|(?:^|[/@._-])pro(?:[/@._-]|$)/i.test(
    value,
  )
}

function installKind(install) {
  if (install.startsWith("npx shadcn@latest add ")) return "shadcn"
  if (install.startsWith("npx luxe add ")) return "luxe"
  if (install === "procedure") return "procedure"
  return null
}

function payloadOk(json) {
  if (!json || typeof json.name !== "string" || json.name.length === 0) return false
  if (Array.isArray(json.files) && json.files.length > 0) return true
  if (typeof json.file === "string" && json.file.length > 0) return true
  if (json.file && typeof json.file === "object") return true
  const style =
    json.type === "registry:style" || json.type === "registry:theme"
  return style && (json.css != null || json.cssVars != null)
}

const catalog = parse(await readFile(catalogPath, "utf8"))
const items = catalog?.items
if (!Array.isArray(items) || items.length === 0) {
  console.error("catalog has no items")
  process.exit(1)
}

let failed = 0
const lines = []

for (const item of items) {
  const missing = required.filter((key) => item[key] == null || item[key] === "")
  const reasons = []
  if (missing.length > 0) reasons.push(`missing ${missing.join(",")}`)
  if (item.tier !== "free") reasons.push("tier is not free")
  if (!Array.isArray(item.limits) || item.limits.length === 0) reasons.push("limits empty")

  const kind = installKind(String(item.install ?? ""))
  if (!kind) reasons.push("install is not shadcn, luxe, or procedure")

  const proBlob = `${item.id} ${item.install} ${item.registry ?? ""}`
  if (isProReference(proBlob)) reasons.push("pro reference")

  if (kind === "procedure") {
    if (item.registry) reasons.push("procedure must not set registry")
  } else if (!item.registry) {
    reasons.push("registry required")
  } else {
    try {
      const response = await fetch(item.registry)
      if (!response.ok) reasons.push(`HTTP ${response.status}`)
      else {
        let json
        try {
          json = await response.json()
        } catch {
          reasons.push("invalid JSON")
        }
        if (json && !payloadOk(json)) reasons.push("payload missing name/files or theme css")
      }
    } catch (error) {
      reasons.push(error instanceof Error ? error.message : "fetch failed")
    }
  }

  const ok = reasons.length === 0
  if (!ok) failed += 1
  lines.push(`${ok ? "ok  " : "fail"}  ${item.id ?? "?"}  ${reasons.join("; ")}`)
}

console.log(lines.join("\n"))
console.log(`\n${items.length - failed} ok, ${failed} fail`)
process.exit(failed === 0 ? 0 : 1)
