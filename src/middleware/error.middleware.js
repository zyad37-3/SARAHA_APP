import { NODE_ENV } from "../config.js"

export const globalmiddeleErorr = (error, req, res, next) => {
    return res.status(error.cause?.status ?? 500).json({
        error_message: error.message || "server error", cause: error.cause,
        stack: NODE_ENV == "production" ? null : error.stack
    })
}