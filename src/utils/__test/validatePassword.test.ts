import { validatePassword } from "../validatePassword"

describe("Validating Password", () => {
  test("It should be a valid password", () => {
    const password = "strongPassword123"
    const passwordErrors = validatePassword(password)
    expect(passwordErrors.length).toBe(0)
  })
  test("It should be too small", () => {
    const password = "123"
    const passwordErrors = validatePassword(password)
    expect(passwordErrors.length).not.toBe(0)
  })
})
