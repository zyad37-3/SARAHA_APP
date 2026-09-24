import { ConflictException, NotFoundException } from "../../common/exceptions/error.exception.js";
import { findByIdAndUpdate } from "../../common/respository/db.respository.js";
import { creatLoginCredentials, decrypt } from "../../common/security/index.js"
import { ACCESS_TOKEN_EXPIRESIN } from "../../config.js";
import { Usermodel } from "../../db/model/user.model.js"

export const profile = async (account) => {
    account.phone = await decrypt(account.phone)
    return account
}
export const updateProfile = async (account, data) => {
    const user = await findByIdAndUpdate({ id: account.id, model: Usermodel, update: data })

    return user
}

export const rotateToken = async (user, payload ,issuer) => {
    const accessExpiresin = (payload.iat + ACCESS_TOKEN_EXPIRESIN) * 1000
    const currentTime = Date.now() + (3 * 60000)
    if (currentTime < accessExpiresin) {
        throw ConflictException({message:"sorry we can not creat now login creadentials while current access token stilled within  valid"})
    }
    return await creatLoginCredentials({ user ,issuer})

}