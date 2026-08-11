import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CarFront, HandCoins, Leaf, ShieldCheck, Sparkles, UsersRound } from "lucide-react"

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
  { icon: UsersRound, title: "Comunidade universitária", description: "Encontre pessoas com rotinas e destinos compatíveis com os seus." },
  { icon: ShieldCheck, title: "Detalhes protegidos", description: "Informações sensíveis aparecem somente depois da autenticação." },
  { icon: HandCoins, title: "Combinação transparente", description: "A contribuição é informativa e o pagamento acontece diretamente entre os usuários." },
  { icon: Leaf, title: "Menos carros no caminho", description: "Compartilhar trajetos ajuda a reduzir custos, trânsito e impacto ambiental." },
]

export default async function LandingPage() {
  const [session, ridesResult, universitiesResult] = await Promise.all([
    getSession(),
    listPublicRidesAction({ limit: 6, availableOnly: "true" }),
    listUniversitiesAction(),
  ])
  const authenticated = Boolean(session)
  const positive = universitiesResult.data?.find((university) => university.name.toLocaleLowerCase().includes("positivo"))
  const publicRides = ridesResult.data?.items ?? []

  return (
    <main className="overflow-hidden">
      <section
        className="relative isolate min-h-[46rem] overflow-hidden bg-hero text-hero-foreground"
        style={{
          backgroundColor: "var(--hero, #1d1c1b)",
          color: "var(--hero-foreground, #ffffff)",
        }}
      >
        <PublicHeader authenticated={authenticated} />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_10%,color-mix(in_srgb,var(--primary)_22%,transparent),transparent_34%),radial-gradient(circle_at_5%_90%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent_30%)]" />
        <div className="absolute -right-32 top-24 -z-10 size-[34rem] rounded-full border border-primary/20" />
        <div className="mx-auto flex min-h-[46rem] max-w-7xl flex-col justify-center px-4 pb-16 pt-32 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="mb-5 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-primary"><Sparkles className="size-4" />Seu trajeto pode conectar pessoas</p>
            <h1 className="text-5xl font-semibold leading-[0.98] tracking-[-0.045em] text-balance sm:text-6xl lg:text-8xl">
              Vá para a universidade <span className="text-primary">em boa companhia.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">Descubra caronas compatíveis com sua rotina ou compartilhe os lugares livres do seu veículo.</p>
          </div>
          <div className="mt-10"><LandingSearch authenticated={authenticated} /></div>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href={authenticated ? "/buscar-carona" : "/login?next=%2Fbuscar-carona"} className={cn(buttonVariants({ variant: "ghost", size: "lg" }), "text-white hover:bg-white/10 hover:text-white")}>Buscar carona <ArrowRight /></Link>
            <Link href={authenticated ? "/oferecer-carona" : "/login?next=%2Foferecer-carona"} className={cn(buttonVariants({ variant: "outline", size: "lg" }), "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white")}>Oferecer carona <CarFront /></Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <SectionHeading eyebrow="Próximos trajetos" title="Caronas disponíveis agora" description="Veja horários e regiões aproximadas. Entre na sua conta para acessar os detalhes da carona." />
        {ridesResult.error ? (
          <EmptyState title="Não foi possível carregar as caronas" description={ridesResult.error} />
        ) : publicRides.length === 0 ? (
          <EmptyState title="Nenhuma carona disponível agora" description="Assim que uma nova carona for publicada, ela aparecerá aqui." />
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {publicRides.map((ride) => {
              const detail = `/caronas/${ride.id}`
              return <RideCard key={ride.id} ride={ride} href={authenticated ? detail : `/login?next=${encodeURIComponent(detail)}`} />
            })}
          </div>
        )}
      </section>

      <section className="bg-muted/50 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading eyebrow="Feito para a rotina real" title="Por que compartilhar o caminho?" description="Uma experiência simples para aproximar quem sai de lugares parecidos e segue para a universidade." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => <article key={benefit.title} className="rounded-3xl border bg-background p-6"><span className="flex size-11 items-center justify-center rounded-2xl bg-primary/20"><benefit.icon className="size-5" /></span><h3 className="mt-6 font-semibold">{benefit.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{benefit.description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-8 lg:py-28">
        <div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Universidades na comunidade</p><h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Conexões que começam no campus</h2><p className="mt-5 leading-7 text-muted-foreground">As instituições abaixo vêm diretamente do catálogo ativo do sistema.</p></div>
        <div className="rounded-[2rem] border bg-card p-8 sm:p-12">
          {universitiesResult.error ? <p className="text-sm text-muted-foreground">{universitiesResult.error}</p> : positive ? (
            <div className="flex flex-col items-center gap-5 text-center"><Image src="/universidade-positivo.svg" alt="Universidade Positivo" width={250} height={77} className="h-auto w-56" /><p className="text-sm text-muted-foreground">{positive.city}, {positive.state}</p></div>
          ) : <EmptyState title="Catálogo em construção" description="As universidades cadastradas aparecerão aqui automaticamente." />}
        </div>
      </section>

      <section className="bg-primary px-4 py-16 text-primary-foreground sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center"><h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">Seu próximo trajeto pode começar aqui.</h2><p className="mt-4 max-w-2xl text-primary-foreground/70">Entre para encontrar uma carona ou ofereça os lugares livres no seu caminho.</p><Link href={authenticated ? "/inicio" : "/cadastro"} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "mt-8")}>{authenticated ? "Ir para o início" : "Criar minha conta"}<ArrowRight /></Link></div>
      </section>
      <footer
        className="bg-hero px-4 py-8 text-sm text-white/55 sm:px-6"
        style={{ backgroundColor: "var(--hero, #1d1c1b)" }}
      ><div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"><span>Carona Universitária</span><span>Pagamentos e combinações acontecem fora da plataforma.</span></div></footer>
    </main>
  )
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-10 max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2><p className="mt-4 leading-7 text-muted-foreground">{description}</p></div>
}
