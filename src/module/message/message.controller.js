import { Router } from "express";
import { fileValidation, localFileUpload, successResponse } from "../../common/utils/index.js";
import { createMessage, deletedMessage, getAllMessage, getMessage } from "./message.service.js";
import { authentication, uploadMulterUpload, validation } from "../../middleware/index.js";
import * as validator from "./message.validation.js"
const router = Router()

const messageFolderName = "messages"
router.post("/",
    authentication(),
    uploadMulterUpload({
        multerMedelware: localFileUpload().any("attachments", 5),
        validation: fileValidation.image,
        isRequired: false,
        customPath: messageFolderName

    }),
    
    validation(validator.createMessage),

    async (req, res, next) => {

        const data = await createMessage(req.validate.body, req.files,req.user )
      

        return successResponse({ res, data, status: 201 })
    })

router.get("/",
    authentication(),
    validation(validator.getAllMassage),
    async (req, res, next) => {


        const data = await getAllMessage(req.validate.query, req.user)
        return successResponse({ res, data })
    })

router.delete("/:messageId",
    authentication(),
    validation(validator.deleteMessage),
    async (req, res, next) => {
        const data = await deletedMessage(req.validate.params, req.user)
        return successResponse({ res, data })
    })
router.get("/:messageId",
    authentication(),
    validation(validator.deleteMessage),
    async (req, res, next) => {
        const data = await getMessage(req.validate.params, req.user)
        return successResponse({ res, data })
    })








export default router