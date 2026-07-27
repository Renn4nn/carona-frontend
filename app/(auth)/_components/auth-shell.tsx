import Link from "next/link"
import { CarFront, MapPin, ShieldCheck, UsersRound } from "lucide-react"

import { Badge } from "@/components/ui/badge"

type AuthShellProps = {
  children: React.ReactNode
  eyebrow: string
  title: string
  description: string
}

const benefits = [
  { icon: MapPin, text: "Rotas que combinam com sua rotina" },
  { icon: UsersRound, text: "Comunidade universitária" },
  { icon: ShieldCheck, text: "Acesso protegido e confiável" },
]

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: AuthShellProps) {
  return (
    <main className="min-h-dvh bg-background">
      <div className="mx-auto grid min-h-dvh max-w-[1600px] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden bg-secondary p-12 text-secondary-foreground lg:flex lg:flex-col lg:justify-between xl:p-16">
          <div className="absolute -right-24 -top-24 size-80 rounded-full border border-primary/30" />
          <div className="absolute -bottom-40 -left-32 size-[30rem] rounded-full bg-primary/10" />

          <Link href="/login" className="relative flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <CarFront className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">Carona Universitária</span>
          </Link>

          <div className="relative max-w-xl">
            <Badge className="mb-6 bg-primary/15 text-primary">
              Mobilidade universitária
            </Badge>
            <h1 className="text-5xl font-semibold tracking-tight text-balance xl:text-6xl">
              Menos trajeto sozinho. Mais conexões pelo caminho.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-secondary-foreground/70">
              Encontre estudantes com destinos parecidos e organize sua rotina
              entre casa e campus com mais praticidade.
            </p>
          </div>

          <div className="relative grid gap-3 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="rounded-2xl border border-secondary-foreground/10 bg-secondary-foreground/5 p-4"
              >
                <benefit.icon className="mb-4 size-5 text-primary" />
                <p className="text-sm leading-6 text-secondary-foreground/80">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/login"
              className="mb-10 flex items-center gap-3 lg:hidden"
            >
              <span className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <CarFront className="size-5" aria-hidden="true" />
              </span>
              <span className="font-semibold">Carona Universitária</span>
            </Link>

            <div className="mb-8">
              <p className="text-sm font-semibold text-primary">{eyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-4 leading-7 text-muted-foreground">
                {description}
              </p>
            </div>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
