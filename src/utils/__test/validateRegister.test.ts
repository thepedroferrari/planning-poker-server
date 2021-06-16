import { validateRegister } from "../validateRegister"

describe("Validating Registry Info", () => {
  test("It should be a valid registration", async () => {
    const email = "john@smith.com"
    const username = "john"
    const password = "strong123"
    const registryErrors = await validateRegister({ username, email, password })

    expect(registryErrors.length).toBe(0)
  })
})
