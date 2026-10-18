import { access, readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { findById } from "./catalog.js"
import { checkLicense } from "./license.js"

const MOTION_RULES = [
  "Use transform and opacity only, ease-out, under 300ms.",
  "Press uses a scale around 0.97.",
  "Prefer transform and opacity, ease-out, under 300ms. Build a longer scene when the user asked for one.",
  "Press uses a scale around 0.97.",
  "Recommend leaving keystrokes, focus moves, and a control used many times a day still. Do not delete a motion the user named.",
  "One first-screen effect is a recommendation, not a cap. Build every motion the user named.",
  "Under prefers-reduced-motion: reduce, keep color and opacity and set the effect transform to none.",
]

export async function planStyle(input, items) {
  const request = String(input.request ?? "")
  const lanes = openLanes(request, input)
  const stack = input.projectRoot ? await readStack(input.projectRoot) : null
  const refusal = refusalFor(request)
  const picks = refusal ? [] : choosePicks(request, input, lanes, items)

  if (stack && !stack.react) {
    return stopped("React is not in package.json. Stop before any install.", lanes, stack)
  }
  if (stack && !stack.tailwind) {
    return stopped("Tailwind CSS is not in package.json. Stop before any install.", lanes, stack)
  }
  if (stack && !stack.componentsJson && picks.some((pick) => pick.install !== "procedure")) {
    return {
      ...basePlan(lanes, stack),
      status: "stop",
      reason: "Registry installs need components.json. Run npx shadcn@latest init and do not restyle the app.",
      picks: [],
      motion: lanes.motion === "open" ? MOTION_RULES : [],
      refusal,
    }
  }
  if (refusal) {
    return {
      ...basePlan(lanes, stack),
      status: "stop",
      reason: refusal.rule,
      picks: [],
      motion: [],
      refusal,
    }
  }

  return {
    ...basePlan(lanes, stack),
    status: stack ? "plan" : "confirm-stack",
    reason: stack
      ? "Lanes follow the request. Install only the picks below."
      : "Pass project_root before installing. React, Tailwind, and components.json were not checked.",
    picks,
    features: featuresFor(request),
    advice: adviceFor(request, lanes),
    motion: lanes.motion === "open" ? MOTION_RULES : [],
    refusal: null,
  }
}

function basePlan(lanes, stack) {
  return {
    writesFiles: false,
    lanes,
    stack,
    doNot: [
      "Do not copy this server or the visual-craft skill folder into the project.",
      "Do not redraw a catalog block from memory. Build a product feature the catalog does not list, such as a QR code.",
      "Do not open a lane the user closed in words, such as only the animation or keep the current style.",
      "Do not copy logos or brand asset files.",
      "Style, when open, is one DESIGN.md plus at most one theme record.",
      "A named block stays the installed registry file. Fit spacing, type, and color. Do not redraw the form.",
    ],
  }
}

function stopped(reason, lanes, stack) {
  return {
    ...basePlan(lanes, stack),
    status: "stop",
    reason,
    picks: [],
    motion: [],
    refusal: null,
  }
}

export function openLanes(request, input = {}) {
  const onlyAnimation = /only the animation|только анимац|анимаци[а-яё]* только/i.test(request)
  const onlyIcons = /only icons|только икон/i.test(request)
  const onlyStyle = /only the style|только стиль/i.test(request)
  const keepStyle = /keep the current style|текущ(?:ий|его) стиль|не меняй стиль|оставь стиль/i.test(request)
  const noAnimation = /no animation|без анимац/i.test(request)
  const landing = /landing|лендинг|продающ|первый экран|first screen|marketing page/i.test(request)
  const auth = /\bauth\b|login|sign-?in|вход|кабинет|авториз/i.test(request)
  const motionWord = /animat|анимац|\bmotion\b|движен/i.test(request)
  const iconWord = /icon|икон/i.test(request)
  const illustration = /lottie|illustration|иллюстрац|картин|сцен|qr|кьюар|picture|scene/i.test(request)
  const lookLike = /make it look|оформи|выгляд|прикольн/i.test(request)
  const visualRequest =
    /дизайн|design|визуал|visual|оформи|restyle|сайт|\bsite\b|магазин|лендинг|landing|первый экран|first screen|фон|background/i.test(
      request,
    )
  const pageRequest =
    visualRequest ||
    lookLike ||
    /переделай|одностранич|страниц|\bpage\b|\bbuild\b|redesign/i.test(request)
  const pageJob = input.pageJob ?? null
  const marketing = landing || pageJob === "category_introduction" || pageRequest

  if (onlyAnimation) {
    return laneSet({ motion: "open" })
  }
  if (onlyIcons) {
    return laneSet({ icons: "open" })
  }
  if (onlyStyle) {
    return laneSet({ style: "open" })
  }

  const styleClosed = keepStyle || onlyAnimation || onlyIcons
  const styleOpen =
    !styleClosed &&
    (lookLike || marketing || (input.hasTheme === false && (marketing || auth || pageJob)))
  const namedPiece = pageRequest || illustration
  const structureClosed =
    onlyAnimation || onlyStyle || onlyIcons || (input.blockExists === true && !namedPiece)
  const structureOpen = !structureClosed && (marketing || auth || pageJob != null || lookLike || namedPiece)
  const motionClosed = noAnimation || onlyIcons || onlyStyle
  const motionOpen =
    !motionClosed &&
    (motionWord || marketing || auth || pageJob === "product_selection" || pageJob === "daily_ui")
  const iconsOpen = iconWord || (structureOpen && input.iconLibrarySet === false)
  const illustrationOpen = illustration && !bulkDownload(request)

  return {
    style: styleOpen ? "open" : "closed",
    structure: structureOpen ? "open" : "closed",
    motion: motionOpen ? "open" : "closed",
    icons: iconsOpen ? "open" : "closed",
    illustration: illustrationOpen ? "open" : "closed",
    motionMode: !motionOpen ? null : pageRequest ? "viewport" : "feedback",
  }
}

function laneSet(open) {
  return {
    style: open.style ?? "closed",
    structure: open.structure ?? "closed",
    motion: open.motion ?? "closed",
    icons: open.icons ?? "closed",
    illustration: open.illustration ?? "closed",
    motionMode: open.motion === "open" ? "feedback" : null,
  }
}

function choosePicks(request, input, lanes, items) {
  const picks = []
  if (lanes.style === "open" && input.hasTheme !== true) {
    picks.push(record(items, themeId(input.tone, lanes)))
  }
  if (lanes.motion === "open" && lanes.motionMode === "viewport") {
    picks.push(record(items, effectId(request)))
  }
  if (lanes.structure === "open" && /\bauth\b|login|sign-?in|вход|кабинет|авториз/i.test(request)) {
    picks.push(record(items, "auth-login-01"))
  }
  if (lanes.motion === "open" && lanes.motionMode === "feedback") {
    const success = /корзин|cart|добав/i.test(request) ? "success-status-mark" : null
    const signup = /успех|success|подпис|signup|запис/i.test(request)
    if (success) picks.push(record(items, success))
    else if (signup) picks.push(record(items, "success-confetti"))
  }
  if (lanes.icons === "open") picks.push(record(items, "icon-lucide"))
  if (lanes.illustration === "open" && /lottie|illustration|иллюстрац/i.test(request)) {
    picks.push(record(items, "lottie-dotlottie"))
  }
  return picks.filter(Boolean)
}

function themeId(tone) {
  if (tone === "developer") return "theme-supabase"
  if (tone === "neutral") return "theme-vercel"
  return "theme-modern-minimal"
}

function effectId(request) {
  if (/video/i.test(request)) return "hero-video-dialog"
  if (/particle|частиц/i.test(request)) return "background-particles"
  if (/aurora|сиян/i.test(request)) return "background-aurora"
  if (/headline|заголов/i.test(request)) return "hero-masked-heading"
  if (/фон|background/i.test(request)) return "background-beams"
  return "hero-spotlight"
}

function record(items, id) {
  const item = findById(items, id)
  if (!item) return null
  return {
    id: item.id,
    role: item.role,
    install: item.install,
    when: item.when,
    limits: item.limits,
  }
}

function featuresFor(request) {
  const features = []
  if (/qr|кьюар/i.test(request)) features.push("QR code")
  return features
}

function adviceFor(request, lanes) {
  const notes = []
  if (featuresFor(request).length > 0) {
    notes.push("Build the named product feature in the project. A missing catalog record is not a refusal.")
  }
  if (lanes.motionMode === "viewport" && /анимац|animation|фон|background/i.test(request)) {
    notes.push("A quieter page is a recommendation. Build every motion the user named.")
  }
  return notes
}

function refusalFor(request) {
  const license = checkLicense(request, {
    lottieCount: bulkDownload(request) ? 30 : 0,
  })
  if (!license.allowed) return license
  return null
}

function bulkDownload(request) {
  return (
    /lottie|animation|анимац/i.test(request) &&
    /\b30\b|bulk|все анимац|пачк[ауеи]/i.test(request)
  )
}

async function readStack(projectRoot) {
  const root = resolve(projectRoot)
  const packagePath = resolve(root, "package.json")
  let pkg
  try {
    pkg = JSON.parse(await readFile(packagePath, "utf8"))
  } catch {
    return { react: false, tailwind: false, componentsJson: false, packageJson: false }
  }
  const deps = { ...pkg.dependencies, ...pkg.devDependencies }
  return {
    react: Boolean(deps.react),
    tailwind: Boolean(deps.tailwindcss || deps["@tailwindcss/vite"]),
    componentsJson: await exists(resolve(root, "components.json")),
    packageJson: true,
  }
}

async function exists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}
