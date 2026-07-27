import type {
  MockFavoriteAddress,
  MockStudentProfile,
  MockVehicle,
} from "@/lib/types/domain"

export const studentProfileMock: MockStudentProfile = {
  id: "profile-1",
  userId: "mock-user",
  fullName: "Estudante Carona",
  courseName: "Sistemas de Informação",
  universityName: "Universidade Metropolitana",
  registrationNumber: "202600184",
  institutionalEmail: "estudante@universidade.edu.br",
}

export const vehiclesMock: MockVehicle[] = [
  {
    id: "vehicle-1",
    ownerId: "mock-user",
    plate: "CAR-2026",
    brand: "Volkswagen",
    model: "Polo",
    color: "Branco",
    year: 2024,
    seats: 4,
    active: true,
  },
  {
    id: "vehicle-2",
    ownerId: "mock-user",
    plate: "UNI-0101",
    brand: "Honda",
    model: "CG 160",
    color: "Preto",
    year: 2023,
    seats: 1,
    active: false,
  },
]

export const favoriteAddressesMock: MockFavoriteAddress[] = [
  {
    id: "address-1",
    userId: "mock-user",
    label: "Casa",
    address: "Rua das Palmeiras, 120 — Centro",
    primary: true,
  },
  {
    id: "address-2",
    userId: "mock-user",
    label: "Universidade",
    address: "Av. do Campus, 500 — Bloco Central",
    primary: false,
  },
]
