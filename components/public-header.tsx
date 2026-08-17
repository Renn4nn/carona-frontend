import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"

import { Brand } from "@/components/brand"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PublicHeader({ authenticated }: { authenticated: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
        <Brand href="/" />

        <nav className="flex items-center gap-2" aria-label="Acesso">
          {authenticated ? (
            <Link href="/inicio" className={cn(buttonVariants({ variant: "outline" }))}>
              <Home className="size-4" aria-hidden="true" />
              Início
            </Link>
          ) : (
            <>
              <Link
                href="/cadastro"
                className={cn(buttonVariants({ variant: "ghost" }), "hidden sm:inline-flex")}
              >
                Criar conta
              </Link>
              <Link href="/login" className={cn(buttonVariants(), "group")}>
                Entrar
                <ArrowRight
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}