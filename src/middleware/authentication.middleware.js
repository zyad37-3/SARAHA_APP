import { ForbiddenException, UnauthorizedException } from "../common/exceptions/error.exception.js"
import { decodedToken } from "../common/security/index.js"
import { roleEnum, TokenTypeEnum } from '../common/enum/index.js';

export const authentication = (tokenType = TokenTypeEnum.ACCSESS) => {
    return async (req, res, next) => {
        const { authorization } = req.headers
        if (!authorization) {
            throw UnauthorizedException({ message: "Unauthorized account" })
        }
        const { user, payload } = await decodedToken({ authorization, tokenType })
        req.user = user
        req.payload = payload

        next()

    }
}
export const authorization = (accessRole) => {
    
    return async (req, res, next) => {
        if (req.user.role < accessRole) {
            throw ForbiddenException({message:'forbidden account'})
        }

        next()

    }
}
