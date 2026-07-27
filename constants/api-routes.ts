export enum RESOURCES {
  AUTH = "auth",
  USER = "user",
  ROLES = "roles",
}

type ResourceId = string | number

type RouteProps = {
  BASE: string
  BY_ID: (id: ResourceId) => string
}

type AuthRouteProps = RouteProps & {
  SIGN_UP: string
  SIGN_IN: string
  REFRESH: string
  LOGOUT: string
}

type ApiRoutes = {
  AUTH: AuthRouteProps
  USER: RouteProps
  ROLES: RouteProps
}

export const API_ROUTES: ApiRoutes = {
  AUTH: {
    BASE: `/${RESOURCES.AUTH}`,
    BY_ID: (id) => `/${RESOURCES.AUTH}/${id}`,
    SIGN_UP: `/${RESOURCES.AUTH}/signup`,
    SIGN_IN: `/${RESOURCES.AUTH}/signin`,
    REFRESH: `/${RESOURCES.AUTH}/refresh`,
    LOGOUT: `/${RESOURCES.AUTH}/logout`,
  },
  USER: {
    BASE: `/${RESOURCES.USER}`,
    BY_ID: (id) => `/${RESOURCES.USER}/${id}`,
  },
  ROLES: {
    BASE: `/${RESOURCES.ROLES}`,
    BY_ID: (id) => `/${RESOURCES.ROLES}/${id}`,
  },
} as const
