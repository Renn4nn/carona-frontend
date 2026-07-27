import { AppHeader } from "@/components/app-header"
import { requireSession } from "@/lib/auth/session"

export default async function PrivateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireSession()

  return (
    <div className="min-h-dvh bg-muted/30">
      <AppHeader login={session.login} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </div>
  )
}
