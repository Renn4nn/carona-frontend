import { AuthShell } from "@/app/(auth)/_components/auth-shell"
import { RegisterForm } from "@/app/(auth)/_components/register-form"
import {
  listCoursesAction,
  listUniversitiesAction,
} from "@/actions/catalog.actions"
import { redirectAuthenticatedUser } from "@/lib/auth/session"

export default async function CadastroPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  await redirectAuthenticatedUser(next)
  const [universitiesResult, coursesResult] = await Promise.all([
    listUniversitiesAction(),
    listCoursesAction(),
  ])
  const catalogError = universitiesResult.error ?? coursesResult.error

  return (
    <AuthShell
      eyebrow=""
      title="Crie sua conta"
      description="Cadastre-se para encontrar estudantes próximos e compartilhar trajetos até a universidade."
    >
      <RegisterForm
        next={next}
        universities={universitiesResult.data ?? []}
        courses={coursesResult.data ?? []}
        catalogError={catalogError}
      />
    </AuthShell>
  )
}
