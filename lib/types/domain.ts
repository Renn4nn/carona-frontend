export type ParticipantStatus =
  | "PENDING"
  | "ACCEPTED"
  | "REJECTED"
  | "CANCELED"
  | "COMPLETED"

export type RideStatus =
  | "OPEN"
  | "FULL"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELED"

export type MockParticipant = {
  id: string
  name: string
  status: ParticipantStatus
}

export type MockRide = {
  id: string
  driverName: string
  origin: string
  destination: string
  departureAt: string
  totalSeats: number
  availableSeats: number
  status: RideStatus
  vehicleId: string
  participants: MockParticipant[]
}

export type MockVehicle = {
  id: string
  ownerId: string
  plate: string
  brand: string
  model: string
  color: string
  year: number
  seats: number
  active: boolean
}

export type MockFavoriteAddress = {
  id: string
  userId: string
  label: string
  address: string
  primary: boolean
}

export type MockStudentProfile = {
  id: string
  userId: string
  fullName: string
  courseName: string
  universityName: string
  registrationNumber: string
  institutionalEmail: string
}
