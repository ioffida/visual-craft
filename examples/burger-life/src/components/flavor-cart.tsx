import { useState } from "react"
import StatusMark from "@/components/StatusMark"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function FlavorCart() {
  const [added, setAdded] = useState(false)
  const [rejected, setRejected] = useState(false)

  function addFlavor() {
    if (added) {
      setRejected(true)
      return
    }

    setAdded(true)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" onClick={addFlavor}>
          Добавить вкус в корзину
        </Button>
        <StatusMark
          status={added ? "done" : "pending"}
          strike={false}
          color="currentColor"
          doneColor="currentColor"
          errorColor="var(--destructive)"
          drawDuration={160}
          label={added ? "Вкус в корзине" : "Не в корзине"}
        />
      </div>
      <p aria-live="polite">
        {added
          ? "Список на этой странице. Заказа нет и оплата не проходит."
          : null}
      </p>
      {rejected ? (
        <Alert>
          <AlertTitle>Вкус уже в корзине</AlertTitle>
          <AlertDescription>Второй раз он не добавляется.</AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
