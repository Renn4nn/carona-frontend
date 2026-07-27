import Link from "next/link"
import { CarFront } from "lucide-react"

export function Brand() {
  return (
    <Link href="/inicio" className="flex items-center gap-3">
      <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
        <CarFront className="size-5" aria-hidden="true" />
      </span>
      <span className="hidden font-semibold sm:inline">
        Carona Universitária
      </span>
    </Link>
  )
}
