type PageHeadingProps = {
  eyebrow?: string
  title: string
  description: string
  action?: React.ReactNode
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold text-primary">{eyebrow}</p>
        )}
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
          {description}
        </p>
      </div>
      {action}
    </div>
  )
}
