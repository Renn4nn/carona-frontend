import { isAxiosError } from "axios"

type ApiErrorBody = {
  error?: {
    message?: string
  }
  errors?: Array<{
    message?: string
  }>
  message?: string
}

export function getApiErrorMessage(error: unknown) {
  if (!isAxiosError<ApiErrorBody>(error)) {
    return "Não foi possível concluir a operação. Tente novamente."
  }

  const body = error.response?.data

  return (
    body?.error?.message ??
    body?.errors?.[0]?.message ??
    body?.message ??
    "Não foi possível conectar ao serviço. Tente novamente."
  )
}
