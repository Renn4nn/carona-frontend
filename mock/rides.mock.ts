import type { MockRide } from "@/lib/types/domain"

export const participatingRidesMock: MockRide[] = [
  {
    id: "ride-participating-1",
    driverName: "Marina Costa",
    origin: "Centro, Campinas",
    destination: "Campus Universitário",
    departureAt: "2026-08-03T07:20:00-03:00",
    totalSeats: 4,
    availableSeats: 1,
    status: "OPEN",
    vehicleId: "vehicle-2",
    participants: [],
  },
]

export const offeredRidesMock: MockRide[] = [
  {
    id: "ride-offered-1",
    driverName: "Você",
    origin: "Jardim das Flores",
    destination: "Campus Universitário",
    departureAt: "2026-08-03T18:10:00-03:00",
    totalSeats: 3,
    availableSeats: 1,
    status: "OPEN",
    vehicleId: "vehicle-1",
    participants: [
      { id: "participant-1", name: "Lucas Lima", status: "ACCEPTED" },
      { id: "participant-2", name: "Ana Souza", status: "PENDING" },
    ],
  },
]
