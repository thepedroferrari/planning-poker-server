export type User = {
  email: {
    address: string
    verified: boolean
  }
  password: string
}

export type UserAuth = {
  email: string
  password: string
}
