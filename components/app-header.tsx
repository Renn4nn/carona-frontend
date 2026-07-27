"use client"

import Link from "next/link"
import { Bell, Menu, MessageCircle, UserRound, X } from "lucide-react"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Brand } from "@/components/brand"
import { cn } from "@/lib/utils"

const navigation = [
  { href: "/inicio", label: "Início", icon: null },
  { href: "/conversas", label: "Conversas", icon: MessageCircle },
  { href: "/perfil", label: "Perfil", icon: UserRound },
]

type AppHeaderProps = {
  login: string
}

export function AppHeader({ login }: AppHeaderProps) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const initials = login.slice(0, 2).toUpperCase()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
              onClick={() => setOpen(true)}
            >
              <Menu aria-hidden="true" />
            </Button>
            <Brand />
          </div>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground",
                  pathname === item.href && "bg-muted text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" aria-label="Notificações">
              <span className="relative">
                <Bell className="size-5" aria-hidden="true" />
                <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-background" />
              </span>
            </Button>
            <Link href="/perfil" aria-label="Abrir perfil">
              <Avatar size="lg">
                <AvatarFallback className="bg-secondary text-secondary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            className="absolute inset-0 bg-secondary/45"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-[min(82vw,20rem)] flex-col bg-background p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <Brand />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fechar menu"
                onClick={() => setOpen(false)}
              >
                <X aria-hidden="true" />
              </Button>
            </div>
            <nav className="mt-10 space-y-2" aria-label="Menu mobile">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 font-medium text-muted-foreground",
                      pathname === item.href && "bg-primary text-primary-foreground",
                    )}
                  >
                    {Icon ? <Icon className="size-5" /> : <CarIcon />}
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  )
}

function CarIcon() {
  return <span className="size-5 rounded-md border-2 border-current" />
}
