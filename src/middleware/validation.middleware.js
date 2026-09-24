import { BadRequestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
    return (req, res, next) => {

        const validation = schema.safeParse(req.body)       
        if (!validation.success) {
            throw BadRequestException({ message: "validation error", extra: { issues: validation.error.issues } })
        }
        req.body = validation.data
        next()

    }
}