import { Router } from "express";
import { successResponse } from './../../common/utils/success.response.js';
import { profile, rotateToken, updateProfile } from "./user.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/enum/security.tokenTypeEnum.js";
import { roleEnum } from "../../common/enum/user.enum.js";


const router = Router()
router.get("/profile", authentication(), authorization(roleEnum.ADMIN), async (req, res, next) => {
    const data = await profile(req.user)
    return successResponse({ res, data })
})
router.patch("/profile/update", authentication(), async (req, res, next) => {
    const data = await updateProfile(req.user, req.body)
    return successResponse({ res, data })
})
router.patch("/rotate_token", authentication({ typeToken: TokenTypeEnum.REFRESH }), async (req, res, next) => {
    const data = await rotateToken(req.user, req.payload, `${req.protocol}://${req.host}`)
    return successResponse({ res, data })
})

export default router