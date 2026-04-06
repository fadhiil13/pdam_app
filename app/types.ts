export interface AdminProfile {
  success: boolean
  message: string
  data: Admin
  count: number
}

export interface Admin {
  id: number
  user_id: number
  name: string
  phone: string
  owner_token: string
  createdAt: string
  updatedAt: string
  user: User
}

export interface User {
  id: number
  username: string
  password: string
  role: string
  owner_token: string
  createdAt: string
  updatedAt: string
}

export interface Customer {
  user: User
  id: number
  user_id: number
  customer_number: string
  name: string
  phone: string
  address: string
  service_id: number
  owner_token: string
  createdAt: string
  updatedAt: string
}

// PENAMBAHAN: Field status untuk Services
export interface Services {
  id: number
  name: string
  min_usage: number
  max_usage: number
  price: number
  status: "active" | "inactive"   // Field baru — tambahkan di database juga
  owner_token: string
  createdAt: string
  updatedAt: string
}