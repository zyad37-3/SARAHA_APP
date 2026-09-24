import { Router } from "express";
import { successResponse } from './../../common/utils/success.response.js';
import { login, signup, signupWithGmail } from "./athentication.service.js";
import { loginSchema, signupSchema } from "./authentication.validation.js";
import { BadRequestException } from "../../common/exceptions/error.exception.js";
import { validation } from "../../middleware/index.js";

const router = Router()
router.post("/signup",validation(signupSchema), async (req, res, next) => {
    const data = await signup(req.body)
    return successResponse({ res, data })
})
router.post("/signup/withgmail", async (req, res, next) => {
    const data = await signupWithGmail(req.body)
    return successResponse({ res, data })
})
router.post("/login",validation(loginSchema), async (req, res, next) => {

    const data = await login(req.body, `${req.protocol}://${req.host}`)
    return successResponse({ res, data })
})
export default router