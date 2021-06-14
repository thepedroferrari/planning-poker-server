declare namespace NodeJS {
  export interface ProcessEnv {
    MONGO_URL: string
    MONGO_USERNAME: string
    MONGO_PASSWORD: string
    MONGO_DB_NAME: string
    COOKIE_SECRET: string
  }
}
