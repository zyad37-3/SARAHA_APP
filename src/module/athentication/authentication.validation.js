import * as z from "zod"
export const loginSchema=z.object({
    email:z.email(),
    password:z.string().min(2).max(20)
})
export const signupSchema=loginSchema.extend({
userName:z.string().min(2).max(25).includes(" "),
phone:z.e164() ,
confirmpassword:z.string().min(2).max(20)
}).refine((value)=>value.password===value.confirmpassword,{error: "Passwords don't match",
    path: ["confirmpassword"],})