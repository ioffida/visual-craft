import { useEffect, useId, useRef, useState, type FormEvent, type MouseEvent } from "react"
import { cn } from "cn"

import { ContentRequirement } from "@/components/content-requirement"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
import { Separator } from "@/components/ui/separator"
import { contentRequirements } from "@/content/requirements"

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const notices = {
  google:
    "Вход через Google не подключён. Кабинет не открывается и оплата не проходит.",
  reset:
    "Сброс пароля не подключён. Письмо для смены пароля не отправляется.",
} as const

type Notice = keyof typeof notices

function isEmail(value: string) {
  return emailPattern.test(value.trim())
}

export function useAccountScreen() {
  const [open, setOpen] = useState(
    () => window.location.hash === "#cabinet",
  )

  useEffect(() => {
    const sync = () => setOpen(window.location.hash === "#cabinet")
    window.addEventListener("hashchange", sync)
    return () => window.removeEventListener("hashchange", sync)
  }, [])

  return open
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const emailId = useId()
  const passwordId = useId()
  const emailErrorId = useId()
  const passwordErrorId = useId()
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const successHeading = useRef<HTMLHeadingElement>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [passwordInvalid, setPasswordInvalid] = useState(false)
  const [notice, setNotice] = useState<Notice | null>(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!submitted) {
      return
    }
    successHeading.current?.focus()
  }, [submitted])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextEmailInvalid = !isEmail(email)
    const nextPasswordInvalid = password.length === 0
    setEmailInvalid(nextEmailInvalid)
    setPasswordInvalid(nextPasswordInvalid)
    setNotice(null)

    if (nextEmailInvalid) {
      emailRef.current?.focus()
      return
    }
    if (nextPasswordInvalid) {
      passwordRef.current?.focus()
      return
    }

    setSubmitted(true)
  }

  function showNotice(next: Notice) {
    return (event: MouseEvent) => {
      event.preventDefault()
      setNotice(next)
    }
  }

  if (submitted) {
    return (
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card>
          <CardHeader className="auth-feedback">
            <CardTitle>
              <h1
                ref={successHeading}
                tabIndex={-1}
                className="text-base font-medium outline-none"
              >
                Вход в кабинет принят на этой странице
              </h1>
            </CardTitle>
            <CardDescription>
              Почта {email.trim()} проверена только здесь. Сессия не создана,
              подписка не оформлена, оплата не прошла.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-base font-medium">Вход в кабинет подписки</h1>
          </CardTitle>
          <CardDescription>
            Введите почту и пароль кабинета. Форма ничего не отправляет и не
            списывает деньги.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} noValidate>
            <FieldGroup>
              {notice ? (
                <Alert key={notice} className="auth-feedback">
                  <AlertTitle>Этот вход не подключён</AlertTitle>
                  <AlertDescription>{notices[notice]}</AlertDescription>
                </Alert>
              ) : null}
              <Field data-invalid={emailInvalid || undefined}>
                <FieldLabel htmlFor={emailId}>Электронная почта</FieldLabel>
                <Input
                  ref={emailRef}
                  id={emailId}
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  aria-invalid={emailInvalid || undefined}
                  aria-describedby={emailInvalid ? emailErrorId : undefined}
                  onChange={(event) => {
                    setEmail(event.target.value)
                    if (emailInvalid) {
                      setEmailInvalid(false)
                    }
                  }}
                />
                {emailInvalid ? (
                  <FieldError id={emailErrorId} className="auth-feedback">
                    Введите почту целиком, с символом @ и доменом.
                  </FieldError>
                ) : null}
              </Field>
              <Field data-invalid={passwordInvalid || undefined}>
                <div className="flex items-center">
                  <FieldLabel htmlFor={passwordId}>Пароль</FieldLabel>
                  <a
                    href="#cabinet"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    onClick={showNotice("reset")}
                  >
                    Забыли пароль?
                  </a>
                </div>
                <Input
                  ref={passwordRef}
                  id={passwordId}
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  aria-invalid={passwordInvalid || undefined}
                  aria-describedby={
                    passwordInvalid ? passwordErrorId : undefined
                  }
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (passwordInvalid) {
                      setPasswordInvalid(false)
                    }
                  }}
                />
                {passwordInvalid ? (
                  <FieldError id={passwordErrorId} className="auth-feedback">
                    Введите пароль. Пустое поле не входит в кабинет.
                  </FieldError>
                ) : null}
              </Field>
              <Field>
                <Button type="submit">Войти в кабинет</Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={showNotice("google")}
                >
                  Войти через Google
                </Button>
                <FieldDescription className="text-center">
                  Нет кабинета?{" "}
                  <a
                    href="#start"
                    className="underline-offset-4 hover:underline"
                  >
                    Записать почту на старт
                  </a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export function AccountLoginScreen() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-10 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        К содержанию
      </a>
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
        <a href="#top" className="font-heading text-lg">
          Burger Life
        </a>
        <a
          href="#subscription"
          className="rounded-md py-1 underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring"
        >
          К подписке
        </a>
      </header>
      <Separator />
      <main
        id="content"
        className="mx-auto flex w-full max-w-md flex-col gap-6 px-5 py-16"
      >
        <LoginForm />
        <ContentRequirement id="account-login">
          {contentRequirements.account}
        </ContentRequirement>
      </main>
    </>
  )
}
