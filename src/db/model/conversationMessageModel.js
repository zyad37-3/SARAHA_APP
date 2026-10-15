import mongoose from "mongoose";


const conversationMessageSchema = mongoose.Schema({
    content: {
        type: String,
        required: function () {
            return this.attachments?.length > 0 ? false : true
        },
        minlength: 2,
        maxlength: 50000,
    },
    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    attachments: [String],
    senderId: { type: mongoose.Types.ObjectId, ref: "User",required: true },
}, {
    timestamps: true,
    strict: true,
    schemaStrict: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },

})
export const ConversationMessageModel = mongoose.model.ConversationMessage || mongoose.model("ConversationMessage", conversationMessageSchema)