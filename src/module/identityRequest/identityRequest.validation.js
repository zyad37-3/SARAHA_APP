import mongoose from "mongoose"
import * as z from "zod"
import { IdentityRequestStatusEnum } from "../../common/enum/message.enum.js"

export const createIdentityRequest = (lang) => {
    return z.object({
        params: z.strictObject({
            messageId: z.string()
        })

    })
}
export const getIdentityRequestAccept = (lang) => {
    return z.object({
        params: z.strictObject({
            IdentityId: z.string().refine(
                (value) => mongoose.Types.ObjectId.isValid(value),
                { message: "Invalid IdentityId" })
        }),
        body: z.strictObject({
            status: z.enum([
                IdentityRequestStatusEnum.ACCEPTED,
                IdentityRequestStatusEnum.REJECTED
            ])
        })

    })
}

