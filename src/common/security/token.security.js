import jwt from 'jsonwebtoken'
import { ACCESS_TOKEN_EXPIRESIN, REFRESH_TOKEN_EXPIRESIN, ACCESS_USER_TOKEN_SIGNATURE, REFRESH_USER_TOKEN_SIGNATURE, ACCESS_ADMIN_TOKEN_SIGNATURE, REFRESH_ADMIN_TOKEN_SIGNATURE } from '../../config.js'
import { findById } from '../respository/db.respository.js'
import { BadRequestException, NotFoundException, UnauthorizedException } from '../exceptions/error.exception.js'
import { Usermodel } from '../../db/model/user.model.js'
import { TokenTypeEnum } from '../enum/security.tokenTypeEnum.js'
import { roleEnum } from '../enum/user.enum.js'

import { randomUUID } from 'node:crypto'
import { exist, set } from '../services/index.js'

export const creatRevokeToken = async ({ payload }) => {


    //الوقت المستغرق
    const consumedTime = (Date.now()) / 1000 - payload.iat
    //بدون ما استدعيها exp as refreshToken جبت 
    const refresExpiresin = payload.iat + REFRESH_TOKEN_EXPIRESIN
    //token وقت نفاذ 
    const ttl = Math.ceil(refresExpiresin - consumedTime)

    await set({ key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }), value: payload.jti, ttl })
    return;

}

export const userBaseKey = ({ userId }) => {
    return `User::${userId.toString()}`
}
export const userBaseRevokeTokenKey = ({ userId }) => {
    return `${userBaseKey({ userId })}::Revoke_Token`
}
export const userRevokeTokenKey = ({ userId, jti }) => {
    return `${userBaseRevokeTokenKey({ userId })}::${jti}`
}

export const userBaseProfileKey= ({ userId }) => {
    return `User::${userId.toString()}::Profile`
}


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
    if (await exist({ key: userRevokeTokenKey({ userId: payload.sub, jti: payload.jti }) })) {
        throw UnauthorizedException({ message: "expired token credentials" })
    }
    const user = await findById({ id: payload.sub, model: Usermodel })
    console.log(user.changeCredetialsTime.getTime());



    if (!user) {
        throw NotFoundException({ message: 'invalid account' })
    }
    if ((user.changeCredetialsTime.getTime() ?? 0) > payload.iat * 1000) {
        throw UnauthorizedException({ message: "expired token credentials" })
    }

    return { user, payload }
}


export const creatLoginCredentials = async ({
    issuer,
    user,
    option = {}
}) => {
    const jwtid = randomUUID()
    const { accessSignature, refreshSignature } = await getTokenSegnature({ role: user.role })
    const access_token = await createToken(
        {
            signature: accessSignature,
            option: {
                ...option,
                audience: [user.role],
                issuer,
                expiresIn: ACCESS_TOKEN_EXPIRESIN,
                jwtid
            },
            payload: { sub: user?._id }
        }
    )

    const refresh_token = await createToken(
        {
            signature: refreshSignature,
            option: {
                ...option,
                audience: [user.role],
                issuer,
                expiresIn: REFRESH_TOKEN_EXPIRESIN,
                jwtid
            },
            payload: { sub: user?._id }
        }
    )
    console.log({ accessSignature, refreshSignature });

    return { access_token, refresh_token }
}
