import Link from "next/link"
import {
  CarFront,
  GraduationCap,
  Route,
  ShieldCheck,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"

type AuthShellProps = {
  badge: string
  children: React.ReactNode
  description: string
  title: string
  variant: "login" | "cadastro"
}

const highlights = [
  {
    icon: Route,
    label: "Rotas universitarias",
    value: "Casa - campus",
  },
  {
    icon: ShieldCheck,
    label: "Comunidade verificada",
    value: "Estudantes",
  },
  {
    icon: Sparkles,
    label: "Experiencia simples",
    value: "Em poucos toques",
  },
]

export function AuthShell({
  badge,
  children,
  description,
  title,
  variant,
}: AuthShellProps) {
  return (
    <main className="h-svh overflow-hidden bg-white text-[#1d1c1b]">
      <div className="grid h-full lg:grid-cols-[1.06fr_0.94fr]">
        <section className="relative hidden overflow-hidden bg-[#1d1c1b] px-6 py-8 text-white sm:px-10 lg:flex lg:h-svh lg:flex-col lg:justify-between lg:px-14 lg:py-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-[#eec131]" />
          <div className="absolute right-[-14rem] top-[-10rem] hidden h-80 w-80 rotate-12 rounded-[3rem] border border-white/10 lg:block" />
          <div className="absolute bottom-[-12rem] left-[-12rem] hidden h-96 w-96 rotate-45 rounded-[4rem] border border-[#eec131]/25 lg:block" />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <Link href="/login" className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-[#eec131] text-[#1d1c1b] shadow-[0_18px_50px_rgba(238,193,49,0.25)]">
                <CarFront className="size-5" aria-hidden="true" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                Carona Universitaria
              </span>
            </Link>

            <nav className="flex rounded-full border border-white/10 bg-white/5 p-1 text-sm backdrop-blur">
              <Link
                href="/login"
                className={cn(
                  "rounded-full px-4 py-2 text-white/70 transition hover:text-white",
                  variant === "login" && "bg-white text-[#1d1c1b] hover:text-[#1d1c1b]"
                )}
              >
                Login
              </Link>
              <Link
                href="/cadastro"
                className={cn(
                  "rounded-full px-4 py-2 text-white/70 transition hover:text-white",
                  variant === "cadastro" &&
                  "bg-white text-[#1d1c1b] hover:text-[#1d1c1b]"
                )}
              >
                Cadastro
              </Link>
            </nav>
          </div>

          <div className="relative z-10 my-16 max-w-2xl lg:my-0">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#eec131]/30 bg-[#eec131]/10 px-4 py-2 text-sm font-medium text-[#eec131]">
              <GraduationCap className="size-4" aria-hidden="true" />
              {badge}
            </div>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/72 sm:text-lg">
              {description}
            </p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.18)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white/[0.09]"
                >
                  <item.icon className="mb-5 size-5 text-[#eec131]" aria-hidden="true" />
                  <p className="text-sm font-medium text-white">{item.value}</p>
                  <p className="mt-1 text-xs leading-5 text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 hidden h-[5.5rem] lg:block" aria-hidden="true" />
        </section>

        <section className="flex h-svh items-center justify-center overflow-y-auto px-5 py-6 sm:px-10 lg:px-12">
          <div className="w-full max-w-[29rem]">{children}</div>
        </section>
      </div>
    </main>
  )
}
