import * as z from "zod"
import { generalValidationFields } from "../../common/validation.js"
import { LangEnum } from "../../common/enum/security.tokenTypeEnum.js"
export const login = (lang) => {
    return z.strictObject({
        email: generalValidationFields.email(lang),
        password: generalValidationFields.password(lang)
    })
}
export const loginSchema = (lang) => {
    return z.object({
        body: login(lang),
      
    })
}

export const signupSchema = (lang) => {
    return z.object({
        body: login(lang).safeExtend({
            userName: generalValidationFields.userName(lang),
            phone: generalValidationFields.phone(lang),
            confirmpassword: generalValidationFields.password(lang),
            role: generalValidationFields.role(lang)
        }).refine((value) => value.password === value.confirmpassword, {
            error: lang === LangEnum.EN ?"Passwords don't match": "كلمتا المرور غير متطابقتين"
            ,
            path: ["confirmpassword"],
        })
    })
}