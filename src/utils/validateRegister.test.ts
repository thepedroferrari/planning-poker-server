import { validateRegister } from "./validateRegister"

describe("Validating Registry Info", () => {
  test("It should be a valid registration", () => {
    const email = "john@smith.com"
    const username = "john"
    const password = "strong123"
    const isValidEmail = validateRegister({ username, email, password })
    expect(isValidEmail).toBe(null)
  })
})
