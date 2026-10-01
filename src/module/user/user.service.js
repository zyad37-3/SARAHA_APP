import { LogoutEnum } from "../../common/enum/security.tokenTypeEnum.js";
import { ConflictException, NotFoundException } from "../../common/exceptions/error.exception.js";
import { findByIdAndUpdate } from "../../common/respository/db.respository.js";
import { creatLoginCredentials, creatRevokeToken, decrypt, userBaseProfileKey, userBaseRevokeTokenKey} from "../../common/security/index.js"
import { del, keys, set } from "../../common/services/index.js";
import { ACCESS_TOKEN_EXPIRESIN, REFRESH_TOKEN_EXPIRESIN } from "../../config.js";
import { Usermodel } from "../../db/model/user.model.js"

export const profile = async (account) => {
    account.phone = await decrypt(account.phone)
    console.log(account);
    
  await set({key: userBaseProfileKey({userId:account._id.toString()}),value:account,ttl:5*60})
    return account

}
export const updateProfile = async (account, data) => {
    const user = await findByIdAndUpdate({ id: account.id, model: Usermodel, update: data })
await del({key: userBaseProfileKey({userId:account._id.toString()})})
    return user
}

export const rotateToken = async (user, payload, issuer) => {
    const accessExpiresin = (payload.iat + ACCESS_TOKEN_EXPIRESIN) * 1000
    const currentTime = Date.now() + (3 * 60000)
    if (currentTime < accessExpiresin) {
        throw ConflictException({ message: "sorry we can not creat now login creadentials while current access token stilled within  valid" })
    }
    const data = await creatLoginCredentials({ user, issuer })
    await creatRevokeToken({ payload })
    return data
}

export const logout = async (user, payload, { action = LogoutEnum.DEVISE }) => {


    switch (action) {
        case LogoutEnum.ALL:
            user.changeCredetialsTime = new Date()
            await user.save()            
            await del({key:await keys({key:userBaseRevokeTokenKey({userId:payload.sub})})})
            break;

        default:
            await creatRevokeToken({ payload })
            break;
    }
    return
}