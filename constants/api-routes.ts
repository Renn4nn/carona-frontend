export enum RESOURCES {
  AUTH = "auth",
  USER = "user",
  ROLES = "roles",
  UNIVERSITIES = "universities",
  COURSES = "courses",
  STUDENT_PROFILES = "student-profiles",
  VEHICLES = "vehicles",
  RIDES = "rides",
  PUBLIC_RIDES = "public/rides",
  RIDE_PARTICIPATIONS = "ride-participations",
  PAYMENT_METHODS = "payment-methods",
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
  UNIVERSITIES: RouteProps
  COURSES: RouteProps
  STUDENT_PROFILES: RouteProps & { ME: string; ACTIVATE: string }
  VEHICLES: RouteProps & { ACTIVATE: (id: ResourceId) => string }
  RIDES: RouteProps & {
    MINE: string
    START: (id: ResourceId) => string
    COMPLETE: (id: ResourceId) => string
    CANCEL: (id: ResourceId) => string
    PARTICIPANTS: (id: ResourceId) => string
    PARTICIPANT_ACTION: (
      rideId: ResourceId,
      participantId: ResourceId,
      action: "accept" | "reject"
    ) => string
    MY_PARTICIPATION: (id: ResourceId) => string
    NEARBY: string
    ROUTE: (id: ResourceId) => string
  }
  PUBLIC_RIDES: RouteProps
  GEO: { AUTOCOMPLETE: string }
  RIDE_PARTICIPATIONS: { ME: string }
  PAYMENT_METHODS: { BASE: string }
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
  UNIVERSITIES: {
    BASE: `/${RESOURCES.UNIVERSITIES}`,
    BY_ID: (id) => `/${RESOURCES.UNIVERSITIES}/${id}`,
  },
  COURSES: {
    BASE: `/${RESOURCES.COURSES}`,
    BY_ID: (id) => `/${RESOURCES.COURSES}/${id}`,
  },
  STUDENT_PROFILES: {
    BASE: `/${RESOURCES.STUDENT_PROFILES}`,
    BY_ID: (id) => `/${RESOURCES.STUDENT_PROFILES}/${id}`,
    ME: `/${RESOURCES.STUDENT_PROFILES}/me`,
    ACTIVATE: `/${RESOURCES.STUDENT_PROFILES}/me/activate`,
  },
  VEHICLES: {
    BASE: `/${RESOURCES.VEHICLES}`,
    BY_ID: (id) => `/${RESOURCES.VEHICLES}/${id}`,
    ACTIVATE: (id) => `/${RESOURCES.VEHICLES}/${id}/activate`,
  },
  RIDES: {
    BASE: `/${RESOURCES.RIDES}`,
    BY_ID: (id) => `/${RESOURCES.RIDES}/${id}`,
    MINE: `/${RESOURCES.RIDES}/mine`,
    START: (id) => `/${RESOURCES.RIDES}/${id}/start`,
    COMPLETE: (id) => `/${RESOURCES.RIDES}/${id}/complete`,
    CANCEL: (id) => `/${RESOURCES.RIDES}/${id}/cancel`,
    PARTICIPANTS: (id) => `/${RESOURCES.RIDES}/${id}/participants`,
    PARTICIPANT_ACTION: (rideId, participantId, action) =>
      `/${RESOURCES.RIDES}/${rideId}/participants/${participantId}/${action}`,
    MY_PARTICIPATION: (id) => `/${RESOURCES.RIDES}/${id}/participants/me`,
    NEARBY: `/${RESOURCES.RIDES}/nearby`,
    ROUTE: (id) => `/${RESOURCES.RIDES}/${id}/route`,
  },
  PUBLIC_RIDES: {
    BASE: `/${RESOURCES.PUBLIC_RIDES}`,
    BY_ID: (id) => `/${RESOURCES.PUBLIC_RIDES}/${id}`,
  },
  GEO: { AUTOCOMPLETE: "/geo/autocomplete" },
  RIDE_PARTICIPATIONS: {
    ME: `/${RESOURCES.RIDE_PARTICIPATIONS}/me`,
  },
  PAYMENT_METHODS: {
    BASE: `/${RESOURCES.PAYMENT_METHODS}`,
  },
} as const
