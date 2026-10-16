import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type ContentRequirementProps = {
  id: string
  children: string
}

export function ContentRequirement({ id, children }: ContentRequirementProps) {
  return (
    <Alert role="note" data-content-requirement={id}>
      <AlertTitle>Content requirement</AlertTitle>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
