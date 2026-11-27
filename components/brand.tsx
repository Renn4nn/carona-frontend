import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

/** Símbolo da logo (pin com o carro) num quadrado branco, legível nos temas claro e escuro. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white p-1 shadow-sm",
        className
      )}
    >
      <Image
        src="/logo-icon.png"
        alt=""
        width={64}
        height={64}
        className="size-full object-contain"
        priority
      />
    </span>
  )
}

export function Brand({ href = "/inicio", inverse = false }: { href?: string; inverse?: boolean }) {
  return (
    <Link href={href} className="flex items-center gap-3">
      <BrandMark />
      <span className={inverse ? "hidden font-semibold text-white sm:inline" : "hidden font-semibold sm:inline"}>
        Carona Universitária
      </span>
    </Link>
  )
}
