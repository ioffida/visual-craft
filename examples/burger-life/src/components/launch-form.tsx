import { useEffect, useId, useRef, useState, type FormEvent } from "react"
import { Confetti, type ConfettiRef } from "@/components/ui/confetti"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isEmail(value: string) {
  return emailPattern.test(value.trim())
}

export function LaunchForm() {
  const emailId = useId()
  const errorId = useId()
  const successHeading = useRef<HTMLHeadingElement>(null)
  const confettiRef = useRef<ConfettiRef>(null)
  const [email, setEmail] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!submitted) {
      return
    }

    successHeading.current?.focus()

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reduceMotion) {
      return
    }

    void confettiRef.current?.fire({
      particleCount: 70,
      spread: 62,
      startVelocity: 28,
      ticks: 140,
      scalar: 0.85,
      origin: { y: 0.65 },
      colors: ["#c81d15", "#f5c518", "#1f6b45", "#3b2418", "#fffdf8"],
    })
  }, [submitted])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isEmail(email)) {
      setInvalid(true)
      return
    }
    setInvalid(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <Card className="relative w-full max-w-xl overflow-hidden">
        <Confetti
          ref={confettiRef}
          manualstart
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 size-full"
        />
        <CardHeader>
          <CardTitle>
            <h3
              ref={successHeading}
              tabIndex={-1}
              className="text-xl outline-none"
            >
              Почта записана на старт
            </h3>
          </CardTitle>
          <CardDescription>
            Заказа нет и списания нет. Письмо о старте уйдёт на {email.trim()},
            когда подключат приём заявок.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>Почта для письма о старте</CardTitle>
        <CardDescription>
          Кнопка записывает адрес на этой странице. Оплаты нет.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} noValidate>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={invalid || undefined}>
              <FieldLabel htmlFor={emailId}>Электронная почта</FieldLabel>
              <Input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (invalid) {
                    setInvalid(false)
                  }
                }}
              />
              <FieldDescription>
                Нужен адрес, на который можно прислать новость о старте продаж.
              </FieldDescription>
              {invalid ? (
                <FieldError id={errorId}>
                  Введите почту целиком, с символом @ и доменом.
                </FieldError>
              ) : null}
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter>
          <Button type="submit" size="lg">
            Записать почту на старт
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
