import { spawnSync } from "node:child_process"
import { cp, mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const productArg = process.argv[2]

const remoteSkills = [
  ["https://github.com/tushaarmehtaa/tushar-skills", "landing-copy"],
  ["https://github.com/anthropics/skills", "frontend-design"],
  ["https://github.com/shadcn-ui/ui", "shadcn"],
  ["https://github.com/vercel-labs/agent-skills", "web-design-guidelines"],
  ["https://github.com/emilkowalski/skills", "review-animations"],
]

const registries = {
  "@aceternity": "https://ui.aceternity.com/registry/{name}.json",
  "@react-bits": "https://reactbits.dev/r/{name}.json",
  "@magicui": "https://magicui.design/r/{name}.json",
}

function run(args, cwd) {
  const result = spawnSync("npx", args, {
    cwd,
    stdio: "inherit",
    shell: process.platform === "win32",
  })
  if (result.error) console.error(result.error.message)
  return result.status ?? 1
}

if (!productArg) {
  console.error("Usage: node scripts/connect.mjs <productDir>")
  process.exit(1)
}

const productDir = resolve(productArg)
const packageJson = JSON.parse(
  await readFile(resolve(productDir, "package.json"), "utf8"),
)
const deps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies,
}
if (!deps.tailwindcss && !deps["@tailwindcss/vite"]) {
  console.error("Tailwind CSS is not in package.json. Add it before connecting.")
  process.exit(1)
}

for (const [repo, skill] of remoteSkills) {
  const status = run(
    ["skills", "add", repo, "--skill", skill, "-a", "cursor", "-y"],
    productDir,
  )
  if (status !== 0) process.exit(status)
}

const skillSrc = resolve(root, "skills", "visual-craft")
const skillDest = resolve(productDir, ".agents", "skills", "visual-craft")
const localStatus = run(
  ["skills", "add", skillSrc, "-a", "cursor", "-y"],
  productDir,
)
if (localStatus !== 0) {
  console.log("Local skills add failed. Copying skills/visual-craft into .agents/skills/visual-craft.")
  await mkdir(resolve(productDir, ".agents", "skills"), { recursive: true })
  await cp(skillSrc, skillDest, { recursive: true, force: true })
}

const componentsPath = resolve(productDir, "components.json")
try {
  const components = JSON.parse(await readFile(componentsPath, "utf8"))
  const current = components.registries ?? {}
  const next = { ...current }
  let changed = false
  for (const [name, url] of Object.entries(registries)) {
    if (next[name] !== url) {
      next[name] = url
      changed = true
    }
  }
  if (changed || components.registries == null) {
    components.registries = next
    await writeFile(componentsPath, `${JSON.stringify(components, null, 2)}\n`)
    console.log("Updated components.json registries.")
  } else {
    console.log("components.json registries already set.")
  }
} catch (error) {
  if (error && error.code === "ENOENT") {
    console.log("No components.json. Run npx shadcn@latest init in the product, then connect again.")
  } else {
    throw error
  }
}

const ruleSrc = resolve(root, "rules", "visual-craft.mdc")
const ruleDest = resolve(productDir, ".cursor", "rules", "visual-craft.mdc")
await mkdir(dirname(ruleDest), { recursive: true })
await cp(ruleSrc, ruleDest)
console.log("Wrote .cursor/rules/visual-craft.mdc.")
