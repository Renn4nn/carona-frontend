"use client"

import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

import { refreshSessionAction } from "@/actions/auth.actions"
import { safeNextPath } from "@/lib/navigation"

export function SessionRenewer({ next }: { next?: string }) {
  const started = useRef(false)
  const router = useRouter()

  useEffect(() => {
    if (started.current) {
      return
    }

    started.current = true

    void refreshSessionAction().then((success) => {
      if (success) {
        router.replace(safeNextPath(next))
      } else {
        router.refresh()
      }
    })
  }, [next, router])

  return (
    <div
      className="flex items-center gap-3 rounded-2xl border bg-card p-5 text-sm text-muted-foreground"
      role="status"
    >
      <LoaderCircle className="size-5 animate-spin text-primary" />
      Renovando sua sessão com segurança...
    </div>
  )
}
