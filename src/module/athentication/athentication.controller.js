import { Router } from "express";
import { successResponse } from './../../common/utils/success.response.js';
import { confirmEmail, login, requestForgotPasswordCode, resendConfirmEmail, resetForgotPassword, signup, signupWithGmail, verifyForgotPassword } from "./athentication.service.js";
import { confirmEmailSchema, loginSchema, resendConfirmEmailSchema, resetForgotPasswordSchema, signupSchema } from "./authentication.validation.js";
import { BadRequestException } from "../../common/exceptions/error.exception.js";
import { validation } from "../../middleware/index.js";

const router = Router()
router.post("/signup",validation(signupSchema), async (req, res, next) => { 
    const data = await signup(req.body.body)
    return successResponse({ res, data })
    
})
router.post("/confirm_Email",validation(confirmEmailSchema), async (req, res, next) => { 
    const data = await confirmEmail(req.body.body)
    return successResponse({ res, data })
    
})
router.post("/resend_Confirm_Email",validation(resendConfirmEmailSchema), async (req, res, next) => { 
    const data = await resendConfirmEmail(req.body.body)
    return successResponse({ res, data })
    
})

router.post("/request_Forgot_PasswordCode",validation(resendConfirmEmailSchema), async (req, res, next) => { 
    const data = await requestForgotPasswordCode(req.body.body)
    return successResponse({ res, data })
    
})
router.post("/verify_Forgot_PasswordCode",validation(confirmEmailSchema), async (req, res, next) => { 
    const data = await verifyForgotPassword(req.body.body)
    return successResponse({ res, data })
    
})
router.patch("/reset_Forgot_PasswordCode",validation(resetForgotPasswordSchema), async (req, res, next) => { 
    const data = await resetForgotPassword(req.body.body)
    return successResponse({ res, data })
    
})

router.post("/signup/withgmail", async (req, res, next) => {
    const data = await signupWithGmail(req.body)
    return successResponse({ res, data })
})
router.post("/login",validation(loginSchema), async (req, res, next) => {


    const data = await login(req.body.body, `${req.protocol}://${req.host}`)
    return successResponse({ res, data })
})
export default router