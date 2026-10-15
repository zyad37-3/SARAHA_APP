import mongoose from "mongoose";


const conversationSchema = mongoose.Schema({
    messageId: {
        type: mongoose.Types.ObjectId,
        ref: "Message",
        required: true
    }
    ,
    participants: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }],
        required: true,
        validate: {
            validator: (value) => value.length === 2,
            message: "A conversation must have exactly two participants"
        }
    },
    identityRequestId: {
        type: mongoose.Types.ObjectId,
        ref: "IdentityRequest",
        required: true,
        unique: true

    }
}, {
    timestamps: true
})
export const ConversationModel = mongoose.model.Conversation || mongoose.model("Conversation", conversationSchema)