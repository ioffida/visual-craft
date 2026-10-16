import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { Spotlight } from "@/components/ui/spotlight"
import { ContentRequirement } from "@/components/content-requirement"
import { FlavorCart } from "@/components/flavor-cart"
import { LaunchForm } from "@/components/launch-form"
import { contentRequirements } from "@/content/requirements"

const steps = [
  {
    title: "Запись",
    body: "Вы оставляете почту. Деньги не списываются, пачка не резервируется.",
  },
  {
    title: "Письмо",
    body: "Когда продажи откроются, на этот адрес задумано письмо со способом заказать корм.",
  },
  {
    title: "Доставка",
    body: "Регулярная доставка начинается только после этого письма. До него подписки нет.",
  },
]

const questions = [
  {
    value: "human-food",
    question: "Это бургер для людей?",
    answer:
      "Нет. Burger Life — корм для кошек. Бургер со стола эта страница не предлагает и не описывает как замену корму.",
  },
  {
    value: "payment",
    question: "Я сейчас оплачиваю подписку?",
    answer:
      "Нет. Кнопка «Записать почту на старт» сохраняет адрес. Заказ не создаётся и оплата не проходит.",
  },
  {
    value: "date",
    question: "Когда начнутся продажи?",
    answer:
      "Дата старта не предоставлена. Письмо задумано на момент открытия продаж. Пока приём заявок не подключён, адрес с этой страницы не уходит.",
  },
  {
    value: "complete",
    question: "Корм уже можно считать полнорационным?",
    answer:
      "«Сбалансированный для кошки» — формулировка продукта. Статус полнорационного корма, норма кормления и лабораторный анализ не предоставлены, поэтому страница этого не утверждает.",
  },
  {
    value: "proof",
    question: "Где отзывы, исследования и сертификаты?",
    answer:
      "Их нет в материалах продукта. Пока нет источников, страница не показывает чужие слова, цифры испытаний и печати.",
  },
]

const proofGaps = [
  { id: "clinical-studies", body: contentRequirements.studies },
  { id: "reviews", body: contentRequirements.reviews },
  { id: "certificates", body: contentRequirements.certificates },
]

export default function App() {
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
        <nav aria-label="Разделы страницы" className="flex flex-wrap gap-x-4 gap-y-2">
          <a href="#flavors" className="rounded-md py-1 underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring">
            Вкусы
          </a>
          <a href="#composition" className="rounded-md py-1 underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring">
            Состав
          </a>
          <a href="#subscription" className="rounded-md py-1 underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring">
            Подписка
          </a>
          <a href="#questions" className="rounded-md py-1 underline-offset-4 hover:underline focus-visible:ring-3 focus-visible:ring-ring">
            Вопросы
          </a>
        </nav>
      </header>
      <Separator />
      <main id="content">
        <section id="top" className="relative overflow-hidden bg-secondary text-secondary-foreground">
          <Spotlight
            className="top-[-35%] left-[-20%] mix-blend-overlay md:left-[5%]"
            fill="#fffef8"
          />
          <div className="relative z-[2] mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.8fr)] md:py-24">
            <div className="flex flex-col items-start gap-6">
              <Badge>Продажи ещё не открыты</Badge>
              <h1 className="max-w-[14ch] text-4xl md:text-6xl">
                Корм для кошек со вкусом бургера
              </h1>
              <p className="max-w-[62ch] text-lg">
                Вкус задуман как у бургера: знакомая связка, а не безымянный
                мясной корм. Рацион задуман для кошки, не для тарелки человека.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  render={<a href="#start" />}
                  nativeButton={false}
                >
                  Записать почту на старт
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={<a href="#subscription" />}
                  nativeButton={false}
                >
                  Как устроена подписка
                </Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Письмо о старте</CardTitle>
                <CardDescription>
                  Оставьте почту. Когда корм можно будет заказать, на неё
                  задумано письмо. Сейчас оплаты нет.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  size="lg"
                  render={<a href="#start" />}
                  nativeButton={false}
                >
                  Записать почту на старт
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section id="flavors" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 md:py-24">
          <h2 className="max-w-[18ch] text-3xl md:text-5xl">Линейка вкусов</h2>
          <p className="max-w-[62ch]">
            В линейке несколько вкусов корма. Каждый должен читаться как бургер,
            а не как новый аромат без имени. Пачек на полке ещё нет: продажи не
            открыты.
          </p>
          <Card className="max-w-3xl">
            <CardHeader>
              <CardTitle>Что уже можно сказать о линейке</CardTitle>
              <CardDescription>
                Это корм для кошек с бургерными вкусами. Один вкус — одна
                позиция линейки. Рецепт позиции страница не показывает.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ContentRequirement id="flavor-lineup">
                {contentRequirements.flavors}
              </ContentRequirement>
              <FlavorCart />
            </CardContent>
          </Card>
        </section>

        <section id="composition" className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl md:text-5xl">Состав</h2>
            <p className="max-w-[62ch]">
              Burger Life обещает сбалансированный корм для кошки со вкусом
              бургера. Это обещание продукта. Лабораторного листа к нему нет.
            </p>
            <p className="max-w-[62ch]">
              Корм не является бургером для людей. Чем именно набран баланс —
              белками, жиром, таурином или другим набором — страница не
              перечисляет, потому что набора нет в исходных данных.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <Separator />
            <ContentRequirement id="recipe-and-analysis">
              {contentRequirements.recipe}
            </ContentRequirement>
          </div>
        </section>

        <section id="subscription" className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 py-16 md:py-24">
          <div className="flex max-w-[62ch] flex-col gap-4">
            <h2 className="text-3xl md:text-5xl">Как работает подписка</h2>
            <p>
              Сейчас открыта только запись на старт продаж. Платная доставка —
              отдельный шаг после письма, не эта форма.
            </p>
          </div>
          <ol className="flex max-w-3xl flex-col gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="font-heading text-3xl text-primary" aria-hidden="true">
                  {index + 1}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl">{step.title}</h3>
                  <p className="max-w-[62ch]">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <ContentRequirement id="subscription-terms">
            {contentRequirements.subscription}
          </ContentRequirement>
        </section>

        <section id="questions" className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-16 md:py-24">
          <h2 className="text-3xl md:text-5xl">Вопросы</h2>
          <Accordion className="max-w-3xl">
            {questions.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="text-base">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="max-w-[62ch]">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section id="proof" className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-16 md:py-24">
          <h2 className="max-w-[16ch] text-3xl md:text-5xl">
            Чего страница не утверждает
          </h2>
          <p className="max-w-[62ch]">
            Этих материалов нет. Пока их нет, здесь не появляются отзывы,
            печати и цифры исследований.
          </p>
          <div className="flex max-w-3xl flex-col gap-3">
            {proofGaps.map((gap) => (
              <ContentRequirement key={gap.id} id={gap.id}>
                {gap.body}
              </ContentRequirement>
            ))}
          </div>
        </section>

        <section id="start" className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)] md:py-24">
          <div className="flex flex-col gap-4">
            <h2 className="max-w-[14ch] text-3xl md:text-5xl">
              Запись на старт продаж
            </h2>
            <p className="max-w-[62ch]">
              Оставьте почту, если хотите письмо в тот момент, когда корм можно
              будет заказать. Это не заказ и не подписка с оплатой.
            </p>
            <ContentRequirement id="launch-intake">
              {contentRequirements.intake}
            </ContentRequirement>
          </div>
          <LaunchForm />
        </section>
      </main>
      <footer className="bg-grill text-wrapper">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8">
          <p className="font-heading text-lg">Burger Life</p>
          <p className="max-w-[62ch]">
            Корм для кошек со вкусом бургера. Продажи не открыты. Юридическое
            лицо, адрес и политика конфиденциальности не предоставлены.
          </p>
        </div>
      </footer>
    </>
  )
}
