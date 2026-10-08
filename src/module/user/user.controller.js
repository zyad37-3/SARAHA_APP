import { Router } from "express";
import { successResponse } from './../../common/utils/success.response.js';
import { profile, rotateToken, updateProfile, logout } from "./user.service.js";
import { authentication, authorization } from "../../middleware/index.js";
import { TokenTypeEnum } from "../../common/enum/security.tokenTypeEnum.js";
import { localFileUpload, fileValidation } from "../../common/utils/multer/local.multer.js";
import { uploadMulterUpload } from "../../middleware/index.js";


const router = Router()
router.get("/profile", authentication(), authorization(), async (req, res, next) => {
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
router.patch("/profile_image",
    authentication(),
    uploadMulterUpload({
        multerMedelware: localFileUpload({ maxFileSize: 3 }).single("attachment"),
        customPath:"users",
        validation:fileValidation.image
    }),
    async (req, res, next) => {

        req.user.image = req.file.finalPath
        await req.user.save()
        return successResponse({ res, data: { user: req.user } })
    })
router.post("/logout", authentication(), authorization(), async (req, res, next) => {
    const data = await logout(req.user, req.payload, req.body)
    return successResponse({ res, data })
})

export default router