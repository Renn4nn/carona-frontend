import Image from "next/image"
import Link from "next/link"
import { ArrowRight, HandCoins, Leaf, ShieldCheck, UsersRound } from "lucide-react"

import { listPublicRidesAction } from "@/actions/ride.actions"
import { listUniversitiesAction } from "@/actions/catalog.actions"
import { LandingSearch } from "@/app/_components/landing-search"
import { EmptyState } from "@/components/empty-state"
import { PublicHeader } from "@/components/public-header"
import { RideCard } from "@/components/ride-card"
import { buttonVariants } from "@/components/ui/button"
import { getSession } from "@/lib/auth/session"
import { cn } from "@/lib/utils"

const benefits = [
  {
    icon: UsersRound,
    title: "Comunidade universitária",
    description: "Encontre pessoas com rotinas e destinos compatíveis com os seus.",
  },
  {
    icon: ShieldCheck,
    title: "Detalhes protegidos",
    description: "Informações sensíveis aparecem somente depois da autenticação.",
  },
  {
    icon: HandCoins,
    title: "Valor transparente",
    description: "Cada passageiro terá o valor calculado pela distância até seu desembarque.",
  },
  {
    icon: Leaf,
    title: "Menos carros no caminho",
    description: "Compartilhar trajetos ajuda a reduzir custos, trânsito e impacto ambiental.",
  },
]

export default async function LandingPage() {
  const [session, ridesResult, universitiesResult] = await Promise.all([
    getSession(),
    listPublicRidesAction({ limit: 6, availableOnly: "true" }),
    listUniversitiesAction(),
  ])

  const authenticated = Boolean(session)
  const positive = universitiesResult.data?.find((university) =>
    university.name.toLocaleLowerCase().includes("positivo")
  )
  const publicRides = ridesResult.data?.items ?? []

  return (
    <main className="overflow-hidden">
      <PublicHeader authenticated={authenticated} />

      {/* Hero — fundo claro, texto + busca à esquerda, imagem contida à direita */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-8 lg:py-20">
          <div className="max-w-xl">
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Vá para a universidade <span className="text-primary">em boa companhia.</span>
            </h1>

            <div className="mt-8">
              <LandingSearch authenticated={authenticated} />
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-muted lg:aspect-square">
            <Image
              src="/hero-carona-universitaria.png"
              alt="Estudantes chegando juntos de carro ao campus universitário"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Caronas disponíveis */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Próximos trajetos"
          title="Caronas disponíveis agora"
          description="Veja horários e regiões aproximadas. Entre na sua conta para acessar os detalhes da carona."
        />

        {ridesResult.error ? (
          <EmptyState title="Não foi possível carregar as caronas" description={ridesResult.error} />
        ) : publicRides.length === 0 ? (
          <EmptyState
            title="Nenhuma carona disponível agora"
            description="Assim que uma nova carona for publicada, ela aparecerá aqui."
          />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicRides.map((ride) => {
              const detail = `/caronas/${ride.id}`
              return (
                <RideCard
                  key={ride.id}
                  ride={ride}
                  href={authenticated ? detail : `/login?next=${encodeURIComponent(detail)}`}
                />
              )
            })}
          </div>
        )}
      </section>

      {/* Benefícios */}
      <section className="border-y bg-muted/35 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Feito para a rotina real"
            title="Por que compartilhar o caminho?"
            description="Uma experiência simples para aproximar quem sai de lugares parecidos e segue para a universidade."
          />

          <div className="grid gap-px overflow-hidden rounded-xl border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="group bg-background p-5 transition-colors hover:bg-muted/40 sm:p-6"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/18 text-foreground transition-colors group-hover:bg-primary/25">
                  <benefit.icon className="size-4" aria-hidden="true" />
                </span>
                <h3 className="mt-5 font-semibold">{benefit.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Universidades */}
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Universidades na comunidade
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Conexões que começam no campus
          </h2>
          <p className="mt-5 leading-7 text-muted-foreground">
            As instituições abaixo vêm diretamente do catálogo ativo do sistema.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 sm:p-12">
          {universitiesResult.error ? (
            <p className="text-sm text-muted-foreground">{universitiesResult.error}</p>
          ) : positive ? (
            <div className="flex flex-col items-center gap-5 text-center">
              <Image
                src="/universidade-positivo.svg"
                alt="Universidade Positivo"
                width={250}
                height={77}
                className="h-auto w-56"
              />
              <p className="text-sm text-muted-foreground">
                {positive.city}, {positive.state}
              </p>
            </div>
          ) : (
            <EmptyState
              title="Catálogo em construção"
              description="As universidades cadastradas aparecerão aqui automaticamente."
            />
          )}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Seu próximo trajeto pode começar aqui.
          </h2>
          <p className="mt-4 max-w-2xl text-primary-foreground/70">
            Entre para encontrar uma carona ou ofereça os lugares livres no seu caminho.
          </p>
          <Link
            href={authenticated ? "/inicio" : "/cadastro"}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "group mt-8")}
          >
            {authenticated ? "Ir para o início" : "Criar minha conta"}
            <ArrowRight className="transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </section>

      <footer className="bg-hero px-4 py-8 text-sm text-hero-foreground/55 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span>Carona Universitária</span>
          <span>O valor considera a distância percorrida por cada passageiro.</span>
        </div>
      </footer>
    </main>
  )
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-7 text-muted-foreground">{description}</p>
    </div>
  )
}