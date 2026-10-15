import { Router } from "express";
import * as validator from "./identityRequest.validation.js"
import { createIdentityRequest, getIdentityRequest, getIdentityRequestAccept } from "./identityRequest.service.js";
import { authentication } from "../../middleware/authentication.middleware.js";
import { validation } from "../../middleware/validation.middleware.js";
import { successResponse } from "../../common/utils/success.response.js";
const router = Router()


router.post("/:messageId",
    authentication(),
    validation(validator.createIdentityRequest),

    async (req, res, next) => {

        const data = await createIdentityRequest(req.validate.params, req.user)
        

        return successResponse({ res, data, status: 201 })
    })

router.get("/",
    authentication(),
    async (req, res, next) => {


        const data = await getIdentityRequest(req.user)
        return successResponse({ res, data })
    })

router.patch("/status/:IdentityId",
    authentication(),
    validation(validator.getIdentityRequestAccept),

    async (req, res, next) => {

        
        const data = await getIdentityRequestAccept(req.validate.params, req.validate.body, req.user)
        return successResponse({ res, data })
    })









export default router