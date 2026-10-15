import * as z from "zod"
import { generalValidationFields } from "../../common/validation.js"

export const createMessage = (lang) => {
    return z.object({
        body: z.strictObject({
            content: z.string().min(2).max(50000).optional(),
            receiverId: generalValidationFields.id(lang)
        }),
        files: z.array(
            generalValidationFields.file(lang)).max(5).optional()
    }).superRefine((data, ctx) => {
        
        
        if (!data.body.content && !data.files?.length) {
            ctx.addIssue({
                code: 'custom',
                path: ['content'],
                message: 'missing messsage content'
            })
        }
    })
}

export const getAllMassage = (lang) => {
    return z.object({
        query: z.strictObject({
            type: z.enum(["0","1","2"]).default("0"),
            search: z.string().optional(),
            limit:z.coerce.number().default(5),
            page:z.coerce.number().default(1),
            
           
        }),
       
    })}
export const deleteMessage = (lang) => {
    return z.object({
        params: z.strictObject({
            messageId: generalValidationFields.id(lang)
           
        }),
       
    })}
