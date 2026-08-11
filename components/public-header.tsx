import Link from "next/link"

import { Brand } from "@/components/brand"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function PublicHeader({ authenticated }: { authenticated: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 text-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Brand href="/" inverse />
        <nav className="flex items-center gap-2" aria-label="Acesso">
          {authenticated ? (
            <Link href="/inicio" className={buttonVariants()}>Ir para o início</Link>
          ) : (
            <>
              <Link href="/cadastro" className={cn(buttonVariants({ variant: "ghost" }), "hidden text-white hover:bg-white/10 hover:text-white sm:inline-flex")}>Criar conta</Link>
              <Link href="/login" className={buttonVariants()}>Entrar</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
