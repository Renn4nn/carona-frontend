import Link from "next/link"
import {
  ArrowRight,
  Building2,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react"

import { AuthShell } from "../_components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CadastroPage() {
  return (
    <AuthShell
      variant="cadastro"
      badge="Comece com seu perfil universitario"
      title="Crie sua rede de caronas com estudantes perto de voce."
      description="Monte um perfil simples para combinar rotas, horarios e instituicoes com quem vive a mesma rotina academica."
    >
      <div className="bg-white p-0 sm:rounded-[2rem] sm:border sm:border-[#1d1c1b]/10 sm:p-8 sm:shadow-[0_24px_90px_rgba(29,28,27,0.12)]">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#eec131]">Conta nova</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1d1c1b]">
            Criar cadastro
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#1d1c1b]/70">
            Informe seus dados para entrar na Carona Universitaria.
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <div className="relative">
              <UserRound
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1d1c1b]/45"
                aria-hidden="true"
              />
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Seu nome"
                autoComplete="name"
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">E-mail institucional</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1d1c1b]/45"
                aria-hidden="true"
              />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="voce@universidade.edu"
                autoComplete="email"
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="university">Instituicao de ensino</Label>
            <div className="relative">
              <Building2
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1d1c1b]/45"
                aria-hidden="true"
              />
              <Input
                id="university"
                name="university"
                type="text"
                placeholder="Nome da universidade"
                autoComplete="organization"
                className="pl-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1d1c1b]/45"
                aria-hidden="true"
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Crie uma senha"
                autoComplete="new-password"
                className="pl-11"
              />
            </div>
          </div>

          <label className="flex items-start gap-3 text-sm leading-6 text-[#1d1c1b]/72">
            <input
              type="checkbox"
              className="mt-1 size-4 rounded border-[#1d1c1b]/20 accent-[#eec131]"
            />
            Aceito receber informacoes importantes sobre minhas caronas e minha
            conta.
          </label>

          <Button className="h-12 w-full rounded-2xl text-base font-semibold shadow-[0_16px_40px_rgba(238,193,49,0.25)]">
            Criar conta
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>

        <div className="mt-8 rounded-3xl bg-[#1d1c1b] p-5 text-white">
          <p className="text-sm leading-6 text-white/72">
            Ja tem uma conta?
            <Link
              href="/login"
              className="ml-1 font-semibold text-[#eec131] transition hover:text-white"
            >
              Entrar agora
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
