import { CircleDashed } from "lucide-react"

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-dashed bg-card px-6 py-12 text-center">
      <CircleDashed className="mx-auto size-8 text-primary" aria-hidden="true" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}
