import { Router } from "express";
import { successResponse } from './../../common/utils/success.response.js';
import { login, signup } from "./athentication.service.js";

const router =Router()
router.post("/signup",async (req,res,next)=>{
     const data=await signup (req.body)
    return successResponse({res,data})
})
router.post("/login",async (req,res,next)=>{
     const data=await login (req.body)
    return successResponse({res,data})
})
export default router