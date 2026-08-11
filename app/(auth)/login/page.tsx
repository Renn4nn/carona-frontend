import { AuthShell } from "@/app/(auth)/_components/auth-shell"
import { LoginForm } from "@/app/(auth)/_components/login-form"
import { SessionRenewer } from "@/app/(auth)/_components/session-renewer"
import {
  hasRefreshSession,
  redirectAuthenticatedUser,
} from "@/lib/auth/session"

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  await redirectAuthenticatedUser(next)
  const canRenewSession = await hasRefreshSession()

  return (
    <AuthShell
      eyebrow="Bem-vindo de volta"
      title="Entre na sua conta"
      description="Acesse suas caronas, acompanhe solicitações e organize sua rotina universitária."
    >
      {canRenewSession ? <SessionRenewer next={next} /> : <LoginForm next={next} />}
    </AuthShell>
  )
}
