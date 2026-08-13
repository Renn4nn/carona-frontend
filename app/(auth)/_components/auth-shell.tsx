import Link from "next/link"
import { CarFront, MapPin, ShieldCheck, UsersRound } from "lucide-react"

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
    <main className="relative isolate min-h-dvh overflow-x-hidden bg-background">
      <div
        className="pointer-events-none absolute -right-24 -top-24 z-0 hidden size-80 rounded-full border border-primary/30 lg:block"
        aria-hidden="true"
      />
      <div className="relative z-10 grid min-h-dvh w-full lg:grid-cols-[1.05fr_0.95fr]">
        <section
          className="relative hidden overflow-hidden bg-hero p-12 text-hero-foreground lg:flex lg:flex-col lg:justify-between xl:p-16"
          style={{
            backgroundColor: "var(--hero, #1d1c1b)",
            color: "var(--hero-foreground, #ffffff)",
          }}
        >
          <div className="absolute -bottom-40 -left-32 size-[30rem] rounded-full bg-primary/10" />

          <Link href="/" className="relative flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <CarFront className="size-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">Carona Universitária</span>
          </Link>

          <div className="relative max-w-xl">
            <h1 className="text-5xl font-semibold tracking-tight text-balance xl:text-6xl">
              Menos trajeto sozinho. Mais conexões pelo caminho.
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-hero-foreground/70">
              Encontre estudantes com destinos parecidos e organize sua rotina
              entre casa e campus com mais praticidade.
            </p>
          </div>

          <div className="relative grid gap-3 xl:grid-cols-3">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="rounded-2xl border border-hero-foreground/10 bg-hero-foreground/5 p-4"
              >
                <benefit.icon className="mb-4 size-5 text-primary" />
                <p className="text-sm leading-6 text-hero-foreground/80">
                  {benefit.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
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
