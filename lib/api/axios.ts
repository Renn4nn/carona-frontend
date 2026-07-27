import "server-only"

import axios from "axios"
import axiosRetry from "axios-retry"

const baseURL = process.env.API_BASE_URL

if (!baseURL) {
  throw new Error("A variável API_BASE_URL não foi configurada.")
}

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
})

axiosRetry(api, {
  retries: 2,
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    const method = error.config?.method?.toLowerCase()
    const isSafeMethod = method === "get" || method === "head" || method === "options"

    return isSafeMethod && axiosRetry.isNetworkOrIdempotentRequestError(error)
  },
  shouldResetTimeout: true,
})
