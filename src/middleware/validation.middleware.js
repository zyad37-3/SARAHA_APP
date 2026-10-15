import { LangEnum } from "../common/enum/security.tokenTypeEnum.js";
import { BadRequestException } from "../common/exceptions/index.js";

export const validation = (schema) => {
    return (req, res, next) => {
        const lang = Number(req.headers['lang']) || LangEnum.EN


        const validation = schema(lang).safeParse({
            body: req.body,
            params: req.params,
            query: req.query,
            files:req.files
            
        })


        if (!validation.success) {
            throw BadRequestException({ message: "validation error", extra: { issues: validation.error.issues } })
        }
        req.validate = validation.data
        next()

    }
}