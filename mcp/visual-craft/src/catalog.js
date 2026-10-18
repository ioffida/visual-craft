import { readFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { parse } from "yaml"

const here = dirname(fileURLToPath(import.meta.url))

export const catalogPath = resolve(here, "../../../skills/visual-craft/catalog.yaml")

let cached

export async function loadCatalog() {
  if (cached) return cached
  const catalog = parse(await readFile(catalogPath, "utf8"))
  if (!Array.isArray(catalog?.items) || catalog.items.length === 0) {
    throw new Error("visual-craft catalog has no items")
  }
  cached = catalog.items
  return cached
}

export function findByRole(items, role) {
  return items.filter((item) => item.role === role)
}

export function findById(items, id) {
  const needle = id.trim().toLowerCase()
  return items.find((item) => item.id.toLowerCase() === needle) ?? null
}

export function searchCatalog(items, { role, query } = {}) {
  const words = String(query ?? "")
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 1)
  return items.filter((item) => {
    if (role && item.role !== role) return false
    if (words.length === 0) return true
    const haystack = `${item.id} ${item.role} ${item.source} ${item.when}`.toLowerCase()
    return words.every((word) => haystack.includes(word))
  })
}

export function publicRecord(item) {
  return {
    id: item.id,
    role: item.role,
    source: item.source,
    tier: item.tier,
    license: item.license,
    install: item.install,
    registry: item.registry ?? null,
    when: item.when,
    limits: item.limits,
  }
}
