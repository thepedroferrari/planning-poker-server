export const __prod__ = process.env.NODE_ENV === "production"

export enum STATUS {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
