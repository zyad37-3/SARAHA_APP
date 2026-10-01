import { BadRequestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
    return (req, res, next) => {
        const lang=Number(req.headers["accept-language"])


        const validation = schema(lang).safeParse({
            body:req.body,  
            params:req.params,  
            query:req.query,  
        })       
        
        
        if (!validation.success) {
            throw BadRequestException({ message: "validation error", extra: { issues: validation.error.issues } })
        }
        req.body = validation.data
        next()

    }
}