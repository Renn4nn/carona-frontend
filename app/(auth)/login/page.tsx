import Link from "next/link"
import { ArrowRight, LockKeyhole, Mail } from "lucide-react"

import { AuthShell } from "../_components/auth-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <AuthShell
      variant="login"
      badge="Entre na sua comunidade academica"
      title="Sua carona para a universidade, todos os dias."
      description="Conecte sua rotina com estudantes da mesma regiao e organize viagens entre casa e campus com uma experiencia simples, segura e elegante."
    >
      <div className="bg-white p-0 sm:rounded-[2rem] sm:border sm:border-[#1d1c1b]/10 sm:p-8 sm:shadow-[0_24px_90px_rgba(29,28,27,0.12)]">
        <div className="mb-8">
          <p className="text-sm font-medium text-[#eec131]">Bem-vindo de volta</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-[#1d1c1b]">
            Fazer login
          </h2>
          <p className="mt-3 text-sm leading-6 text-[#1d1c1b]/70">
            Acesse sua conta para encontrar ou oferecer uma carona.
          </p>
        </div>

        <form className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
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
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="password">Senha</Label>
              <Link
                href="#"
                className="text-sm font-medium text-[#1d1c1b]/70 transition hover:text-[#1d1c1b]"
              >
                Esqueci minha senha
              </Link>
            </div>
            <div className="relative">
              <LockKeyhole
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#1d1c1b]/45"
                aria-hidden="true"
              />
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="current-password"
                className="pl-11"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-[#1d1c1b]/72">
            <input
              type="checkbox"
              className="size-4 rounded border-[#1d1c1b]/20 accent-[#eec131]"
            />
            Manter conectado neste dispositivo
          </label>

          <Button className="h-12 w-full rounded-2xl text-base font-semibold shadow-[0_16px_40px_rgba(238,193,49,0.25)]">
            Entrar
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </form>

        <div className="mt-8 rounded-3xl bg-[#1d1c1b] p-5 text-white">
          <p className="text-sm leading-6 text-white/72">
            Ainda nao participa?
            <Link
              href="/cadastro"
              className="ml-1 font-semibold text-[#eec131] transition hover:text-white"
            >
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  )
}
