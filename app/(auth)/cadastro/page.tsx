import { AuthShell } from "@/app/(auth)/_components/auth-shell"
import { RegisterForm } from "@/app/(auth)/_components/register-form"
import { redirectAuthenticatedUser } from "@/lib/auth/session"

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  await redirectAuthenticatedUser(next)

  return (
    <AuthShell
      eyebrow="Sua jornada começa aqui"
      title="Crie sua conta"
      description="Cadastre-se para encontrar estudantes próximos e compartilhar trajetos até a universidade."
    >
      <RegisterForm next={next} />
    </AuthShell>
  )
}
