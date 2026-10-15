import mongoose from "mongoose"
import * as z from "zod"
import { IdentityRequestStatusEnum } from "../../common/enum/message.enum.js"
import { generalValidationFields } from "../../common/validation.js";




export const sendConversationMessages = (lang) => {
    return z.object({
        body: z.strictObject({
            conversationId: generalValidationFields.id(lang),

            content: z.string()
                .trim()
                .min(2)
                .max(50000)
                .optional()
        }),

        files: z.array(
            generalValidationFields.file(lang)
        ).max(5).optional()

    }).superRefine((data, ctx) => {

        if (!data.body.content && !data.files?.length) {
            ctx.addIssue({
                code: "custom",
                path: ["body", "content"],
                message: "Message content or at least one attachment is required"
            });
        }

    });
};


export const getIdentityRequestAccept = (lang) => {
    return z.object({
        params: z.strictObject({
            IdentityId: z.string().refine(
                (value) => mongoose.Types.ObjectId.isValid(value),
                { message: "Invalid IdentityId" })
        }),

    })
}

