export type User = {
  username: string
  email: {
    address: string
    verified: boolean
  }
  password: string
  registrationDate: number
}

export type UserAuth = {
  email: string
  password: string
}

export type RegisterUser = UserAuth & {
  username: string
}
