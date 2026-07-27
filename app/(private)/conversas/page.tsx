import { MessageCircleMore } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export default function ConversasPage() {
  return (
    <div className="flex min-h-[65dvh] items-center justify-center">
      <Card className="w-full max-w-lg text-center">
        <CardContent className="flex flex-col items-center py-10">
          <span className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <MessageCircleMore className="size-7" aria-hidden="true" />
          </span>
          <h1 className="text-2xl font-semibold">Conversas</h1>
          <p className="mt-3 text-muted-foreground">Em desenvolvimento</p>
        </CardContent>
      </Card>
    </div>
  )
}
