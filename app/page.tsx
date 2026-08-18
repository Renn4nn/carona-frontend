import Image from "next/image"
import Link from "next/link"
import {
  ArrowDown,
  ArrowRight,
  CarFront,
  CheckCircle2,
  HandCoins,
  Leaf,
  Route,
  Send,
  ShieldCheck,
  UsersRound,
  SmilePlus
} from "lucide-react"

import { listUniversitiesAction } from "@/actions/catalog.actions"
import { listPublicRidesAction } from "@/actions/ride.actions"
import { LandingSearch } from "@/app/_components/landing-search"
import { EmptyState } from "@/components/empty-state"
import { PublicHeader } from "@/components/public-header"
import { RideCard } from "@/components/ride-card"
import { buttonVariants } from "@/components/ui/button"
import { getSession } from "@/lib/auth/session"
import { cn } from "@/lib/utils"

const stats = [
  { value: "2.400+", label: "estudantes ativos" },
  { value: "18.000+", label: "caronas realizadas" },
  { value: "R$ 320", label: "economia media/mes" },
  { value: "12 ton", label: "CO2 evitado" },
]

const benefits = [
  {
    icon: HandCoins,
    title: "Divida os custos",
    description: "Compartilhe o trajeto com quem vai para uma regiao parecida e alivie o bolso no fim do mes.",
  },
  {
    icon: UsersRound,
    title: "Comunidade universitaria",
    description: "Conecte-se com estudantes que vivem a mesma rotina e chegam aos mesmos lugares.",
  },
  {
    icon: Leaf,
    title: "Menos carros, mais futuro",
    description: "Cada carona compartilhada ajuda a reduzir custos, transito e impacto ambiental.",
  },
  {
    icon: ShieldCheck,
    title: "Simples e protegido",
    description: "Detalhes sensiveis ficam para usuarios autenticados e o fluxo continua direto.",
  },
]

const driverJourney = [
  { icon: CarFront, title: "Publique a rota", description: "Informe início, destino, horário e vagas do veículo." },
  { icon: Send, title: "Receba pedidos", description: "Estudantes interessados solicitam uma parada no caminho." },
  { icon: UsersRound, title: "Escolha quem vai", description: "Aceite ou recuse cada pedido enquanto houver vagas." },
  { icon: CheckCircle2, title: "Feche a viagem", description: "Com as vagas completas — ou quando preferir — encerre as solicitações até a partida." },
]

const testimonials = [
  {
    quote: "Economizei no mes e ainda conheci gente que faz o mesmo caminho todos os dias.",
    name: "Juliana M.",
    course: "Engenharia Civil",
  },
  {
    quote: "Antes eu dependia de transporte lotado. Agora consigo chegar mais tranquilo na aula.",
    name: "Rafael S.",
    course: "Medicina",
  },
  {
    quote: "Ofereco os lugares livres do carro e divido um trajeto que eu ja faria sozinho.",
    name: "Breno T.",
    course: "Direito",
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
    <main className="public-landing overflow-hidden bg-background text-foreground">
      <PublicHeader authenticated={authenticated} />

      <section className="relative isolate bg-hero pt-16 text-hero-foreground lg:pt-20">
        <div className="pointer-events-none absolute -left-52 top-12 -z-10 size-[34rem] rounded-full bg-primary/18 blur-[140px]" aria-hidden="true" />
        <div className="pointer-events-none absolute right-0 top-1/2 -z-10 size-80 rounded-full bg-primary/10 blur-[120px]" aria-hidden="true" />
        <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8 lg:py-16">
          <div className="max-w-xl">
            <h1 className="font-display text-5xl font-black leading-[1.02] text-balance sm:text-6xl lg:text-7xl">
              A carona que faltava <span className="block font-normal italic text-primary">na faculdade.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-hero-foreground/64 sm:text-lg">
              Conecte-se com estudantes da sua universidade, compartilhe custos e chegue com mais tranquilidade.
            </p>

            <div className="mt-9 max-w-md">
              <LandingSearch authenticated={authenticated} />
            </div>

            <Link
              href="#rides"
              className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-hero-foreground/65 transition-colors hover:text-hero-foreground"
            >
              Ver caronas disponiveis
              <ArrowDown className="size-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="relative hidden min-h-[20rem] overflow-hidden rounded-3xl border-7 border-black/55 bg-hero-foreground/6 shadow-2xl shadow-black/20 lg:block lg:min-h-[38rem]">
            <Image
              src="/hero-carona-universitaria.png"
              alt="Estudantes chegando juntos de carro ao campus universitario"
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(125deg,rgba(29,28,27,0.84)_0%,rgba(29,28,27,0.25)_48%,rgba(5,5,5,0.84)_100%)]"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-11 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl font-black leading-none sm:text-4xl">{stat.value}</p>
              <p className="mt-2 text-sm font-medium text-primary-foreground/65">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Como funciona"
            title="Uma rota, escolhas claras e uma viagem confirmada."
            description="O motorista mantém o controle da carona; quem precisa de uma vaga pede uma parada no percurso."
          />

          <div className="rounded-3xl bg-hero p-6 text-hero-foreground sm:p-8 lg:p-10">
            <div className="mb-8 flex flex-col gap-3 border-b border-hero-foreground/10 pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <SmilePlus className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-bold uppercase tracking-wider text-primary">De carona!</p>
                  <h3 className="font-display text-2xl font-bold">Da publicação ao fechamento</h3>
                </div>
              </div>
              <span className="w-fit rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Você decide quem embarca</span>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {driverJourney.map((step, index) => (
                <article key={step.title} className="rounded-2xl border border-hero-foreground/10 bg-hero-foreground/5 p-5">
                  <span className="mb-8 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-black text-primary-foreground">{index + 1}</span>
                  <step.icon className="mb-4 size-6 text-primary" aria-hidden="true" />
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-hero-foreground/58">{step.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-hero-foreground/10 bg-hero-foreground/5 p-4 text-sm leading-6 text-hero-foreground/68">
              <Route className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <p><strong className="text-hero-foreground">Para quem vai de passageiro:</strong> encontre uma rota, solicite a parada desejada e aguarde a decisão do motorista.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="rides" className="bg-hero px-4 py-20 text-hero-foreground sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              dark
              eyebrow="Caronas em alta"
              title="Rotas disponiveis agora mesmo."
              description="Veja horarios e regioes aproximadas. Entre na sua conta para acessar os detalhes da carona."
            />
            <Link
              href={authenticated ? "/buscar-carona" : "/login?next=%2Fbuscar-carona"}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "w-fit rounded-lg border-primary/35 bg-transparent text-primary hover:bg-primary/10 hover:text-primary"
              )}
            >
              Ver todas as caronas
              <ArrowRight aria-hidden="true" />
            </Link>
          </div>

          {ridesResult.error ? (
            <EmptyState title="Nao foi possivel carregar as caronas" description={ridesResult.error} />
          ) : publicRides.length === 0 ? (
            <EmptyState
              title="Nenhuma carona disponivel agora"
              description="Assim que uma nova carona for publicada, ela aparecera aqui."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </section>

      <section className="bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Por que usar"
            title="Mais do que uma carona, uma rotina melhor."
            description="A plataforma foi pensada para diminuir atrito no deslocamento universitario."
          />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article key={benefit.title} className="border-t-2 border-primary pt-6">
                <benefit.icon className="size-8 text-foreground" aria-hidden="true" />
                <h3 className="mt-5 font-display text-xl font-bold">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-primary px-4 py-16 text-primary-foreground sm:px-6 lg:px-8 lg:py-20">
        <div className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-black leading-tight text-balance sm:text-5xl">
            A universidade comeca quando voce sai de casa.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-primary-foreground/65 font-bold">
            Compartilhe trajetos, diminua custos e transforme deslocamentos repetidos em novas conexoes.
          </p>
          <Link
            href={authenticated ? "/oferecer-carona" : "/login?next=%2Foferecer-carona"}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-8 rounded-lg p-8")}
          >
            Quero oferecer carona
            <ArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section id="testimonials" className="border-t border-border/70 bg-background px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionHeading
            eyebrow="Depoimentos"
            title="Quem usa, nao volta atras."
            description="Relatos de alguns estudantes."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className={cn(
                  "rounded-2xl p-8",
                  index === 1
                    ? "bg-hero text-hero-foreground"
                    : "border border-border bg-background shadow-sm"
                )}
              >
                <p className="font-display text-5xl font-black leading-none text-primary">&quot;</p>
                <p className={cn("mt-4 leading-7", index === 1 ? "text-hero-foreground/80" : "text-muted-foreground")}>
                  {testimonial.quote}
                </p>
                <div className="mt-7">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className={cn("text-sm", index === 1 ? "text-hero-foreground/45" : "text-muted-foreground")}>
                    {testimonial.course}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-hero px-4 py-7 text-sm text-hero-foreground/50 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-bold text-primary">Carona <span className="font-normal text-hero-foreground">Universitaria</span></p>
          <span>© 2026 · Mobilidade universitária</span>
        </div>
      </footer>
    </main>
  )
}

function SectionHeading({
  dark = false,
  eyebrow,
  title,
  description,
}: {
  dark?: boolean
  eyebrow: string
  title: string
  description: string
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-primary sm:text-base">{eyebrow}</p>
      <h2 className={cn("mt-3 font-display text-4xl font-bold leading-tight text-balance", dark && "text-hero-foreground")}>
        {title}
      </h2>
      <p className={cn("mt-4 leading-7", dark ? "text-hero-foreground/55" : "text-muted-foreground")}>
        {description}
      </p>
    </div>
  )
}
