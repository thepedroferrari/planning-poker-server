import { validateUsername } from "../validateUsername"

describe("Validating Username", () => {
  test("It should be a valid username", () => {
    const username = "john"
    const usernameErrors = validateUsername(username)
    expect(usernameErrors.length).toBe(0)
  })
  test("It should be too small", () => {
    const username = "jo"
    const usernameErrors = validateUsername(username)
    expect(usernameErrors.length).not.toBe(0)
  })
  test("It should fail due to @ symbol", () => {
    const username = "john@smith.com"
    const usernameErrors = validateUsername(username)
    expect(usernameErrors.length).not.toBe(0)
  })
})
