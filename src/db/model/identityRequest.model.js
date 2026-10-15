import mongoose from "mongoose";
import { IdentityRequestStatusEnum } from "../../common/enum/index.js";
const identityRequestSchema = mongoose.Schema({
    messageId: {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        required: true
    },
    requesterId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type:String,
        enum:Object.values(IdentityRequestStatusEnum),
        default:IdentityRequestStatusEnum.PENDING

    }
},{
    timestamps: true
})
export const IdentityRequestModel=mongoose.model.IdentityRequest||mongoose.model("IdentityRequest",identityRequestSchema)