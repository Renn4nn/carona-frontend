"use client"

import { useEffect, useState } from "react"
import { autocompleteAddress } from "@/actions/geo.actions"
import { Input } from "@/components/ui/input"
import type { RideLocation } from "./ride-location-picker"

type Suggestion = RideLocation & { id: string; label: string }

export function AddressAutocomplete({
  id,
  value,
  placeholder,
  onChange,
  onSelect,
}: {
  id: string
  value: string
  placeholder: string
  onChange: (value: string) => void
  onSelect: (suggestion: Suggestion) => void
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>()

  useEffect(() => {
    const query = value.trim()
    if (query.length < 3) {
      const clearTimer = window.setTimeout(() => {
        setSuggestions([])
        setError(undefined)
      }, 0)
      return () => window.clearTimeout(clearTimer)
    }
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError(undefined)
      const result = await autocompleteAddress(query)
      setSuggestions(result.data ?? [])
      setError(result.error)
      setLoading(false)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [value])

  return (
    <div className="relative">
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        className="pl-12"
        onChange={(event) => onChange(event.target.value)}
        autoComplete="off"
      />
      {loading ? (
        <p className="absolute z-10 mt-1 w-full rounded-md border bg-popover p-3 text-sm text-muted-foreground shadow">
          Buscando endereços...
        </p>
      ) : null}
      {!loading && error ? (
        <p
          className="absolute z-10 mt-1 w-full rounded-md border border-destructive/30 bg-popover p-3 text-sm text-destructive shadow"
          role="alert"
        >
          {error}
        </p>
      ) : null}
      {!loading && suggestions.length > 0 ? (
        <ul
          className="absolute z-10 mt-1 w-full overflow-hidden rounded-md border bg-popover shadow"
          role="listbox"
        >
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                className="w-full px-3 py-2 text-left text-sm hover:bg-accent"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onSelect(suggestion)
                  setSuggestions([])
                }}
              >
                {suggestion.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
