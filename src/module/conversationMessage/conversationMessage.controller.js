import { Router } from "express";
import * as validator from "./conversationMessage.validation.js"
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { successResponse } from "../../common/utils/success.response.js";
import { fileValidation, localFileUpload } from "../../common/utils/index.js";
import { uploadMulterUpload } from "../../middleware/multer.middleware.js";
import { getConversationMessages, sendConversationMessage } from "./conversationMessage.service.js";
const router = Router()


router.post("/",
    authentication(),
    uploadMulterUpload({
        multerMedelware: localFileUpload().any("attachments", 5),
        validation: fileValidation.image,
        isRequired: false,
        customPath: "messages"

    }),

    validation(validator.sendConversationMessages),

    async (req, res, next) => {

        const data = await sendConversationMessage(req.validate.body, req.user)
        

        return successResponse({ res, data, status: 201 })
    })
router.get("/",
    authentication(),

    async (req, res, next) => {

        const data = await getConversationMessages( req.query,req.user)
        return successResponse({ res, data, status: 201 })
    })










export default router