import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_EXPIRESIN, REFRESH_TOKEN_EXPIRESIN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_USER_TOKEN_SIGNATURE, ACCESS_ADMIN_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE } from '../../config.js'
import { findById } from '../respository/db.respository.js'
import { BadRequestException, NotFoundException } from '../exceptions/error.exception.js'
import { Usermodel } from '../../db/model/user.model.js'
import { TokenTypeEnum } from '../enum/security.tokenTypeEnum.js'
import { roleEnum } from '../enum/user.enum.js'

export const createToken = async ({

    payload = {},
    signature = ACCESS_USER_TOKEN_SIGNATURE,
    option = {}
}) => {
    return jwt.sign(payload, signature, option)
}


export const verifyToken = async ({
    token = {},
    signature = ACCESS_USER_TOKEN_SIGNATURE,

}) => {
    return jwt.verify(token, signature)
}


const getTokenSegnature = async ({ role = roleEnum.USER } = {}) => {
    let signature;
    switch (role) {
        case roleEnum.ADMIN:
            signature = { accessSignature: ACCESS_ADMIN_TOKEN_SIGNATURE, refreshSignature: REFRESH_ADMIN_TOKEN_SIGNATURE }
            break;

        default:
            signature = { accessSignature: ACCESS_USER_TOKEN_SIGNATURE, refreshSignature: REFRESH_USER_TOKEN_SIGNATURE }

            break;
    }
    return signature
}


const getSegnature = async ({ tokenType = TokenTypeEnum.ACCSESS, role = roleEnum.USER } = {}) => {
    const signature = await getTokenSegnature({ role })
    return tokenType == TokenTypeEnum.ACCSESS ? signature.accessSignature : signature.refreshSignature
}


export const decodedToken = async ({
    authorization = "",
    tokenType = TokenTypeEnum.ACCSESS
}) => {
    const decoded = jwt.decode(authorization)
    console.log({ decoded });
    if (!decoded?.aud?.length) {
        throw BadRequestException({ message: 'missing token payload' })
    }

    const payload = await verifyToken({ token: authorization, signature: await getSegnature({ tokenType, role: decoded.aud[0] }) })

    if (!payload?.sub) {
        throw BadRequestException({ message: 'missing token payload' })
    }
    const user = await findById({ id: payload.sub, model: Usermodel })


    if (!user) {
        throw NotFoundException({ message: 'invalid account' })
    }
    return { user, payload }
}


export const creatLoginCredentials = async ({
    issuer,
    user,
    option = {}
}) => {
    const { accessSignature, refreshSignature } = await getTokenSegnature({ role:user.role  })
    const access_token = await createToken(
        {
            signature: accessSignature,
            option: {
                ...option,
                audience: [user.role ],
                issuer,
                expiresIn: ACCESS_TOKEN_EXPIRESIN,
            },
            payload:{ sub: user?._id }
        }
    )

    const refresh_token = await createToken(
        {
            signature: refreshSignature,
            option: {
                ...option,
                audience: [user.role ],
                issuer,
                expiresIn: REFRESH_TOKEN_EXPIRESIN,
            },
             payload:{ sub: user?._id }
        }
    )
    console.log({ accessSignature, refreshSignature });

    return { access_token, refresh_token }
}
