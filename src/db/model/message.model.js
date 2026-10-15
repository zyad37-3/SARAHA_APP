import mongoose from "mongoose";


const messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: function () {
            return this.attachments?.length>0?false:true
        },
        minlength: 2,
        maxlength: 50000,
    },
    attachments: [String],
    senderId: { type: mongoose.Types.ObjectId, ref: "User" },
    receiverId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
}, {
    timestamps: true,
    strict: true,
    schemaStrict: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },

})
export const Messagemodel = mongoose.model.Message || mongoose.model("Message", messageSchema)