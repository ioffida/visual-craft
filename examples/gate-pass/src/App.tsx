import { useEffect, useState } from "react"
import { MotionConfig } from "motion/react"
import QRCode from "qrcode"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Button } from "@/components/ui/button"

const code = "GP-1842"

export default function App() {
  const [markup, setMarkup] = useState("")
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    let cancelled = false
    QRCode.toString(code, {
      type: "svg",
      margin: 1,
      width: 180,
      color: { dark: "#0c0f14", light: "#f4f1ea" },
    })
      .then((svg) => {
        if (!cancelled) setMarkup(svg)
      })
      .catch(() => {
        if (!cancelled) setMarkup("")
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative min-h-svh overflow-hidden">
        <BackgroundBeams />
        <section className="relative z-10 mx-auto flex min-h-svh w-full max-w-sm flex-col items-center justify-center gap-6 px-4 py-10 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Gate Pass</h1>
          <p className="font-mono text-2xl tracking-widest">{code}</p>
          <div
            className="rounded-lg bg-[#f4f1ea] p-3 [&_svg]:h-auto [&_svg]:max-w-full"
            role="img"
            aria-label={code}
            dangerouslySetInnerHTML={{ __html: markup }}
          />
          <Button
            type="button"
            size="lg"
            className="active:scale-[0.97]"
            onClick={() => setConfirmed(true)}
          >
            {confirmed ? "Confirmed" : "Confirm"}
          </Button>
          {confirmed ? (
            <p className="pass-status text-sm text-accent" role="status">
              Pass confirmed.
            </p>
          ) : null}
        </section>
      </main>
    </MotionConfig>
  )
}
