import Link from "next/link"
import { ArrowRight, Home } from "lucide-react"

import { Brand } from "@/components/brand"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PublicHeader({ authenticated }: { authenticated: boolean }) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-hero-foreground/10 bg-hero/88 text-hero-foreground backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:h-20 lg:px-8">
        <Brand href="/" inverse />

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex" aria-label="Navegação pública">
          <Link href="/#how" className="whitespace-nowrap text-sm font-medium text-hero-foreground/65 transition-colors hover:text-hero-foreground">
            Como funciona
          </Link>
          <Link href="/#rides" className="whitespace-nowrap text-sm font-medium text-hero-foreground/65 transition-colors hover:text-hero-foreground">
            Caronas em alta
          </Link>
          <Link href="/#testimonials" className="whitespace-nowrap text-sm font-medium text-hero-foreground/65 transition-colors hover:text-hero-foreground">
            Depoimentos
          </Link>
        </nav>

        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Acesso">
          {authenticated ? (
            <Link
              href="/inicio"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-sm border-hero-foreground/15 bg-hero-foreground/5 text-hero-foreground hover:bg-hero-foreground/10 hover:text-hero-foreground"
              )}
            >
              <Home className="size-4" aria-hidden="true" />
              Início
            </Link>
          ) : (
            <>
              <Link
                href="/cadastro"
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "hidden text-hero-foreground/82 hover:bg-hero-foreground/10 hover:text-hero-foreground sm:inline-flex"
                )}
              >
                Criar conta
              </Link>
              <Link href="/login" className={cn(buttonVariants(), "group rounded-sm px-5")}>
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
