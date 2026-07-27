export type TokenType = "access" | "refresh"

export type JwtPayload = {
  sub: string
  login: string
  role: string
  type: TokenType
  jti: string
}

export type AuthenticatedUser = {
  id: string
  login: string
  role: string
}

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export type AuthResult = {
  user: AuthenticatedUser
  accessToken: string
  expiresIn: number
}
