import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV ?? 'development'

config({ path: resolve(`.env.${NODE_ENV}`) })

export const PORT = parseInt(process.env.PORT ?? "9000")

export const DB_URI = process.env.DB_URI
export const RADIS_URI = process.env.RADIS_URI


export const APP_EMAIL = process.env.APP_EMAIL
export const APP_PASSWORD = process.env.APP_PASSWORD

export const APPLICATION_NAME = process.env.APPLICATION_NAME


export const ENC_KEY = process.env.ENC_KEY
export const IV_LENGTH = parseInt(process.env.IV_LENGTH??"16")

export const ACCESS_ADMIN_TOKEN_SIGNATURE = process.env.ACCESS_ADMIN_TOKEN_SIGNATURE
export const ACCESS_TOKEN_EXPIRESIN = parseInt(process.env.ACCESS_TOKEN_EXPIRESIN??"1800")
export const ACCESS_USER_TOKEN_SIGNATURE = process.env.ACCESS_USER_TOKEN_SIGNATURE


export const REFRESH_ADMIN_TOKEN_SIGNATURE = process.env.REFRESH_ADMIN_TOKEN_SIGNATURE
export const REFRESH_TOKEN_EXPIRESIN = parseInt(process.env.REFRESH_TOKEN_EXPIRESIN??"31536000")
export const REFRESH_USER_TOKEN_SIGNATURE = process.env.REFRESH_USER_TOKEN_SIGNATURE
