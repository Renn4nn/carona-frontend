export type DataType = Record<string, unknown> | Record<string, unknown>[]

export type ApiError = {
  type: string
  message: string
  details: string
}

export type ApiErrorResponse =
  | Record<"error", ApiError>
  | Record<"errors", ApiError[]>

export type ApiSuccessResponse<T extends DataType> = {
  data: T
}

export type ApiMessageResponse<T> = {
  data: T
}

export type ApiResponse<T extends DataType> =
  | ApiSuccessResponse<T>
  | ApiErrorResponse
