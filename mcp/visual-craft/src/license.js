// Same pro check as scripts/verify-catalog.mjs. Do not scan component source.
const PRO_REFERENCE =
  /magicui-pro|react-?bits-pro|@(?:[\w-]+-)?pro\b|(?:^|[/@._-])pro(?:[/@._-]|$)/i

export function isProReference(value) {
  return PRO_REFERENCE.test(String(value ?? ""))
}

export function checkLicense(candidate, { lottieCount = 0, userMarkedFree = false } = {}) {
  const text = String(candidate ?? "").trim()
  if (!text) {
    return refuse("A license check needs an id, install command, or URL.")
  }
  if (isProReference(text)) {
    return refuse("Pro registries are refused. Pick another free catalog record.")
  }
  if (/icons8/i.test(text)) {
    return refuse("Icons8 is unused. Icons come from components.json iconLibrary, default Lucide.")
  }
  if (/refero/i.test(text)) {
    return refuse("Refero MCP is refused.")
  }
  const manyAnimations =
    lottieCount > 1 ||
    (/lottie|animation|анимац/i.test(text) &&
      (/\b(30|bulk)\b|all animations|все анимац|пачк[ауеи]/i.test(text)))
  if (manyAnimations) {
    return refuse("One Lottie file per request. Bulk downloads stop the task.")
  }
  if (/lottie/i.test(text) && /premium/i.test(text)) {
    return refuse("Premium Lottie animations stop the task.")
  }
  if (/hover\.dev/i.test(text) && !userMarkedFree && !/\bfree\b/i.test(text)) {
    return refuse("A Hover.dev component is copied only when the user points at a page marked Free.")
  }
  if (/aceternity/i.test(text) && /\b(blocks?|templates?)\b/i.test(text)) {
    return refuse("Aceternity blocks and templates are refused. Free components only.")
  }
  return {
    allowed: true,
    rule: "The candidate is not a refused Pro, Icons8, Refero, Hover, bulk, or premium item.",
  }
}

function refuse(rule) {
  return { allowed: false, rule }
}
