import { readdir, readFile, stat } from "node:fs/promises"
import { resolve, sep } from "node:path"
import { openLanes } from "./plan.js"
import { isProReference } from "./license.js"

const TEXT_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".md", ".json"])
const SKIP_DIRS = new Set(["node_modules", "dist", ".git", ".agents", "coverage"])

export async function checkVisual(input) {
  const request = String(input.request ?? "")
  const lanes = openLanes(request, input)
  const filesChanged = (input.filesChanged ?? []).map((file) => file.replaceAll("\\", "/"))
  const checks = []

  checks.push(laneCheck(lanes, filesChanged, request))

  if (input.projectRoot) {
    const root = resolve(input.projectRoot)
    const disk = await scanProject(root)
    checks.push(packageCheck(disk))
    checks.push(reducedMotionCheck(lanes, disk))
    checks.push(pressScaleCheck(lanes, request, disk))
    checks.push(lottieCheck(lanes, disk))
    checks.push(redrawCheck(request, disk))
  } else {
    checks.push({
      id: "disk",
      pass: false,
      evidence: "Pass project_root to check files. The server does not guess a path and does not write one.",
    })
  }

  const failed = checks.filter((check) => !check.pass)
  return {
    writesFiles: false,
    lanes,
    passed: failed.length === 0,
    checks,
  }
}

function laneCheck(lanes, filesChanged, request) {
  const styleTouched = filesChanged.some((file) =>
    /(^|\/)DESIGN\.md$/.test(file) || /(^|\/)index\.css$/.test(file),
  )
  const userClosedStyle = /only the animation|только анимац|анимаци[а-яё]* только|keep the current style|текущ(?:ий|его) стиль|только стиль|only the style/i.test(
    request,
  )
  if (lanes.style === "closed" && styleTouched && userClosedStyle) {
    return {
      id: "lanes",
      pass: false,
      evidence: "The user closed the style lane, and DESIGN.md or index.css is in files_changed.",
    }
  }
  if (lanes.style === "closed" && styleTouched) {
    return {
      id: "lanes",
      pass: true,
      advice: "Style files changed while the style lane was closed. Keep the change if the user asked for it.",
      evidence: "Style files changed. The closed lane is advice, not a failure.",
    }
  }
  return {
    id: "lanes",
    pass: true,
    evidence:
      lanes.style === "closed"
        ? "Style is closed and the reported diff does not include DESIGN.md or index.css."
        : "Style is open, so a DESIGN.md or theme file may change.",
  }
}

function packageCheck(disk) {
  if (isProReference(disk.packageText) || /icons8/i.test(disk.packageText)) {
    return {
      id: "license",
      pass: false,
      evidence: "package.json names a Pro registry package or Icons8.",
    }
  }
  return { id: "license", pass: true, evidence: "package.json has no Pro registry package and no Icons8." }
}

function reducedMotionCheck(lanes, disk) {
  if (lanes.motion !== "open") {
    return { id: "reduced-motion", pass: true, evidence: "Motion is closed, so no motion check applies." }
  }
  const animated = /animate-|@keyframes|transition/.test(disk.sourceText)
  if (!animated) {
    return { id: "reduced-motion", pass: true, evidence: "No animation marker was found in src." }
  }
  if (!/prefers-reduced-motion/.test(disk.sourceText)) {
    return {
      id: "reduced-motion",
      pass: false,
      evidence: "src animates, and prefers-reduced-motion is missing.",
    }
  }
  return {
    id: "reduced-motion",
    pass: true,
    evidence: "src mentions prefers-reduced-motion. Confirm the effect transform becomes none.",
  }
}

function pressScaleCheck(lanes, request, disk) {
  const auth = /\bauth\b|login|sign-?in|вход|кабинет|авториз/i.test(request)
  if (lanes.motion !== "open" || !auth) {
    return { id: "press-scale", pass: true, evidence: "Press scale is required for an auth action, which this request is not." }
  }
  if (!/active:scale-|scale\(\s*0\.97|scale:\s*0\.97/.test(disk.sourceText)) {
    return {
      id: "press-scale",
      pass: false,
      evidence: "Auth motion is open and no press scale around 0.97 was found.",
    }
  }
  return { id: "press-scale", pass: true, evidence: "A press scale around 0.97 is present." }
}

function lottieCheck(lanes, disk) {
  if (disk.lottieCount > 1) {
    return {
      id: "lottie",
      pass: false,
      evidence: `Found ${disk.lottieCount} animation files. One file per request.`,
    }
  }
  if (disk.lottieCount === 1 && !disk.credits) {
    return {
      id: "lottie",
      pass: false,
      evidence: "One animation file is present and public/animations/CREDITS.md is missing.",
    }
  }
  if (lanes.illustration === "closed" && disk.lottieCount > 0) {
    return {
      id: "lottie",
      pass: true,
      advice: "An animation file is present even though the illustration lane was closed. Keep it if the user asked for the scene.",
      evidence: "One animation file is present. A closed illustration lane is advice, not a failure.",
    }
  }
  return {
    id: "lottie",
    pass: true,
    evidence:
      disk.lottieCount === 0
        ? "No Lottie file was added."
        : "One animation file has public/animations/CREDITS.md.",
  }
}

function redrawCheck(request, disk) {
  const auth = /\bauth\b|login|sign-?in|вход|кабинет|авториз/i.test(request)
  if (!auth || !disk.loginForm) {
    return { id: "origin", pass: true, evidence: "No auth form file to compare." }
  }
  const localAccount = /function useAccountScreen|const emailPattern/.test(disk.loginForm)
  if (localAccount) {
    return {
      id: "origin",
      pass: false,
      evidence:
        "login-form.tsx defines its own account flow. Install auth-login-01 and keep the registry markup.",
    }
  }
  return { id: "origin", pass: true, evidence: "login-form.tsx does not replace the block with a local account flow." }
}

async function scanProject(root) {
  const packageText = await readText(resolve(root, "package.json"))
  const sourceFiles = await walk(resolve(root, "src"))
  const animationFiles = await walk(resolve(root, "public", "animations"))
  const sourceText = sourceFiles.map((file) => file.text).join("\n")
  const login = sourceFiles.find((file) => file.path.endsWith(`${sep}login-form.tsx`) || file.path.endsWith("/login-form.tsx"))
  const credits = animationFiles.some((file) => file.path.endsWith("CREDITS.md"))
  const lottieCount = animationFiles.filter((file) => /\.(json|lottie)$/i.test(file.path)).length
  return { packageText, sourceText, loginForm: login?.text ?? "", lottieCount, credits }
}

async function walk(dir) {
  let entries
  try {
    entries = await readdir(dir, { recursive: true, withFileTypes: true })
  } catch {
    return []
  }
  const files = []
  for (const entry of entries) {
    if (!entry.isFile()) continue
    const path = entry.parentPath ? resolve(entry.parentPath, entry.name) : resolve(dir, entry.name)
    if (path.split(/[/\\]/).some((part) => SKIP_DIRS.has(part))) continue
    const ext = path.slice(path.lastIndexOf("."))
    if (!TEXT_EXT.has(ext)) continue
    const info = await stat(path)
    if (info.size > 200_000) continue
    files.push({ path, text: await readText(path) })
    if (files.length >= 200) break
  }
  return files
}

async function readText(path) {
  try {
    return await readFile(path, "utf8")
  } catch {
    return ""
  }
}
