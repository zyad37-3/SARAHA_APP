import mongoose from "mongoose";
import { genderEnum, roleEnum } from "../../common/enum/index.js";

const userSchema = mongoose.Schema({

    fristName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,

        required: true
    },
    phone: String,
    DOB: String,
    confirmEmail: Date,
    image: String,
    coverImage: [String],
    gender: {
        type: Number,
        enum: Object.values(genderEnum),
        default: genderEnum.MALE
    },
    role: {
        type: Number,
        enum: Object.values(roleEnum),
        default: roleEnum.USER
    },

}, {
    timestamps: true,
    strict: true,
    schemaStrict: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    

})

userSchema.virtual("userName").set(function (value) {
const [fristName,lastName]=value.split(" ")
this.set({fristName,lastName})
}).get(function(){
    return `${this.fristName} ${this.lastName}`
})
export const Usermodel =mongoose.model.User || mongoose.model("User", userSchema)