import { validateEmail } from "../validateEmail"

describe("Validate Email", () => {
  test("It should be a valid email", () => {
    const email = "john@smith.com"
    const isValidEmail = validateEmail(email)
    expect(isValidEmail).toBe(true)
  })
  test("It should accept special characters", () => {
    const email = "!#$%&'*+-/=?^_`{|}~@smith.com"
    const isValidEmail = validateEmail(email)
    expect(isValidEmail).toBe(true)
  })
  test("It should be a invalid email", () => {
    const email = "@johnsmith.com"
    const isValidEmail = validateEmail(email)
    expect(isValidEmail).toBe(false)
  })
  test("It should not allow spaces", () => {
    const email = "john @ smith.com"
    const isValidEmail = validateEmail(email)
    expect(isValidEmail).toBe(false)
  })
})
