import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-12 w-full min-w-0 rounded-2xl border border-input bg-white px-4 py-3 text-sm text-foreground shadow-[0_1px_0_rgba(29,28,27,0.04)] transition-all outline-none placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-primary aria-invalid:ring-primary/25",
        className
      )}
      {...props}
    />
  )
}

export { Input }
