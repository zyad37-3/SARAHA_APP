import { Router } from "express";
import { successResponse } from './../../common/utils/success.response.js';
import { confirmEmail, login, requestForgotPasswordCode, resendConfirmEmail, resetForgotPassword, signup, signupWithGmail, verifyForgotPassword } from "./athentication.service.js";
import { confirmEmailSchema, loginSchema, resendConfirmEmailSchema, resetForgotPasswordSchema, signupSchema } from "./authentication.validation.js";
import { validation } from "../../middleware/index.js";
import { del } from "../../common/services/cache.service.js";
import { generateRateLimiter } from "../../common/utils/limiters.js";



const router = Router()

router.post("/signup", validation(signupSchema), async (req, res, next) => {
    const data = await signup(req.validate.body)
    return successResponse({ res, data })

})
router.post("/confirm_Email", validation(confirmEmailSchema), async (req, res, next) => {
    const data = await confirmEmail(req.validate.body)
    return successResponse({ res, data })

})
router.post("/resend_Confirm_Email", validation(resendConfirmEmailSchema), async (req, res, next) => {
    const data = await resendConfirmEmail(req.validate.body)
    return successResponse({ res, data })

})

router.post("/request_Forgot_PasswordCode", validation(resendConfirmEmailSchema), async (req, res, next) => {
    const data = await requestForgotPasswordCode(req.validate.body)
    return successResponse({ res, data })

})
router.post("/verify_Forgot_PasswordCode", validation(confirmEmailSchema), async (req, res, next) => {
    const data = await verifyForgotPassword(req.validate.body)
    return successResponse({ res, data })

})
router.patch("/reset_Forgot_PasswordCode", validation(resetForgotPasswordSchema), async (req, res, next) => {
    const data = await resetForgotPassword(req.validate.body)
    return successResponse({ res, data })

})

router.post("/signup/withGmail", async (req, res, next) => {
    const data = await signupWithGmail(req.body)
    return successResponse({ res, data })
})
const loginLimiter = generateRateLimiter({ ttl:3,limit: 5,skipSuccessfulRequests:true })

router.post("/login", loginLimiter, validation(loginSchema), async (req, res, next) => {

    const data = await login(req.validate.body, `${req.protocol}://${req.host}`)
    await del({ key: req.rateLimit.key })
    return successResponse({ res, data })
})
export default router