"use server"

import { z } from "zod"
import { API_ROUTES } from "@/constants/api-routes"
import { api } from "@/lib/api/axios"
import { getAuthorizationHeaders } from "@/lib/api/authenticated"
import { getApiErrorMessage } from "@/lib/api/errors"

const suggestionSchema = z.strictObject({
  id: z.string(),
  label: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

export async function autocompleteAddress(query: string) {
  const value = query.trim()
  if (value.length < 3)
    return { data: [] as z.infer<typeof suggestionSchema>[] }
  try {
    const response = await api.get(API_ROUTES.GEO.AUTOCOMPLETE, {
      params: { q: value },
      headers: await getAuthorizationHeaders(),
    })
    return { data: z.array(suggestionSchema).parse(response.data.data) }
  } catch (error) {
    return { error: getApiErrorMessage(error) }
  }
}
