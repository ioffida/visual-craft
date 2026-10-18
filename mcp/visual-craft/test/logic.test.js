import assert from "node:assert/strict"
import { mkdtemp, mkdir, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import test from "node:test"
import { loadCatalog } from "../src/catalog.js"
import { checkVisual } from "../src/check.js"
import { checkLicense } from "../src/license.js"
import { openLanes, planStyle } from "../src/plan.js"

test("a selling page opens style, structure, and one viewport effect", async () => {
  const items = await loadCatalog()
  const plan = await planStyle({ request: "сделай продающий лендинг", hasTheme: false, tone: "consumer" }, items)
  assert.equal(plan.lanes.style, "open")
  assert.equal(plan.lanes.structure, "open")
  assert.equal(plan.lanes.motion, "open")
  assert.equal(plan.lanes.motionMode, "viewport")
  assert.equal(plan.lanes.illustration, "closed")
  assert.equal(plan.writesFiles, false)
  assert.ok(plan.picks.some((pick) => pick.id === "theme-modern-minimal"))
  assert.ok(plan.picks.some((pick) => pick.id === "hero-spotlight"))
  assert.ok(plan.picks.some((pick) => pick.id === "nav-floating"))
  assert.ok(plan.picks.some((pick) => pick.id === "pricing-cards"))
  assert.ok(plan.picks.some((pick) => pick.id === "faq-accordion"))
  assert.ok(plan.picks.some((pick) => pick.id === "footer-links"))
})

test("reworking a button stays on the button", async () => {
  const items = await loadCatalog()
  const plan = await planStyle({ request: "переделай кнопку", hasTheme: true }, items)
  assert.equal(plan.lanes.style, "closed")
  assert.equal(plan.lanes.structure, "open")
  assert.notEqual(plan.lanes.motionMode, "viewport")
  assert.ok(plan.picks.some((pick) => pick.id === "button-shadcn"))
  assert.equal(plan.picks.some((pick) => pick.role === "nav"), false)
})

test("only the animation leaves style and theme untouched", async () => {
  const items = await loadCatalog()
  const plan = await planStyle({ request: "добавь анимацию только на кнопку", hasTheme: true }, items)
  assert.deepEqual(plan.lanes, {
    style: "closed",
    structure: "closed",
    motion: "open",
    icons: "closed",
    illustration: "closed",
    motionMode: "feedback",
  })
  assert.equal(plan.picks.some((pick) => pick.role === "theme"), false)
})

test("an auth screen on an existing theme installs login-01 and does not restyle", async () => {
  const items = await loadCatalog()
  const plan = await planStyle(
    { request: "добавь экран входа в личный кабинет", hasTheme: true, blockExists: false },
    items,
  )
  assert.equal(plan.lanes.style, "closed")
  assert.equal(plan.lanes.structure, "open")
  assert.equal(plan.lanes.motionMode, "feedback")
  assert.ok(plan.picks.some((pick) => pick.id === "auth-login-01"))
  assert.equal(plan.picks.some((pick) => pick.role === "theme"), false)
})

test("a pro install and a bulk lottie download are refused", () => {
  assert.equal(checkLicense("@magicui-pro/hero-1").allowed, false)
  assert.equal(checkLicense("скачай 30 анимаций с LottieFiles").allowed, false)
  assert.equal(checkLicense("auth-login-01").allowed, true)
  assert.equal(checkLicense("icons8 flutter").allowed, false)
})

test("a one-page tool redesign still gets one first-screen effect", async () => {
  const items = await loadCatalog()
  const plan = await planStyle(
    { request: "переделай дизайн одностраничного инструмента", hasTheme: true },
    items,
  )
  assert.equal(plan.lanes.style, "open")
  assert.equal(plan.lanes.motionMode, "viewport")
  assert.ok(plan.picks.some((pick) => pick.role === "hero" || pick.role === "background" || pick.role === "text"))
})

test("a requested background is a background record, including on a shop site", async () => {
  const items = await loadCatalog()
  const plan = await planStyle({ request: "сделай дизайн сайта зоомагазина, нужен живой фон", hasTheme: true }, items)
  assert.equal(plan.lanes.motionMode, "viewport")
  assert.ok(plan.picks.some((pick) => pick.id === "background-beams"))
})

test("a one-page piece with animation and a QR code is built, not refused", async () => {
  const items = await loadCatalog()
  const plan = await planStyle(
    { request: "сделай одностраничную прикольную штуку с анимацией и QR-кодом", hasTheme: true, blockExists: true },
    items,
  )
  assert.notEqual(plan.status, "stop")
  assert.equal(plan.lanes.style, "open")
  assert.equal(plan.lanes.structure, "open")
  assert.equal(plan.lanes.motionMode, "viewport")
  assert.equal(plan.lanes.illustration, "open")
  assert.deepEqual(plan.features, ["QR code"])
  assert.ok(plan.advice.some((note) => /not a refusal/i.test(note)))
})

test("only the animation does not open style from the phrase alone", () => {
  const lanes = openLanes("only the animation", { hasTheme: false })
  assert.equal(lanes.style, "closed")
  assert.equal(lanes.motion, "open")
})

test("check-visual reads a project and does not require a write", async () => {
  const root = await mkdtemp(join(tmpdir(), "visual-craft-"))
  await writeFile(
    join(root, "package.json"),
    JSON.stringify({ dependencies: { react: "19.0.0", tailwindcss: "4.0.0" } }),
  )
  await mkdir(join(root, "src"), { recursive: true })
  await writeFile(join(root, "src", "button.tsx"), "button { transition: opacity 150ms; }\n")
  const result = await checkVisual({
    request: "только анимацию на кнопку",
    projectRoot: root,
    filesChanged: ["src/button.tsx"],
  })
  assert.equal(result.writesFiles, false)
  assert.equal(result.checks.find((check) => check.id === "lanes").pass, true)
  assert.equal(result.checks.find((check) => check.id === "license").pass, true)
  assert.equal(result.checks.find((check) => check.id === "reduced-motion").pass, false)
})

test("a style file in an animation-only diff fails the lane check", async () => {
  const result = await checkVisual({
    request: "только анимацию",
    filesChanged: ["DESIGN.md"],
  })
  assert.equal(result.checks.find((check) => check.id === "lanes").pass, false)
})
