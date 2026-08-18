import { Inbox } from "lucide-react"

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-hero-foreground/10 bg-hero-foreground/5 px-6 py-12 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Inbox className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-lg font-semibold tracking-tight text-hero-foreground">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-hero-foreground/55">
        {description}
      </p>
    </div>
  )
}
