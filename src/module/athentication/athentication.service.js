import { ConflictException, NotFoundException } from "../../common/exceptions/index.js";
import { creatLoginCredentials, decrypt, encrypt } from "../../common/security/index.js";
import { compare, hash } from "../../common/security/index.js";
import { createToken } from "../../common/security/index.js";
import { Usermodel } from "../../db/model/index.js";
import { create, findOne } from './../../common/respository/index.js';
export async function signup({ email, password, userName, phone }) {
    const user = await findOne({ model: Usermodel, filter: { email: email } })
    if (user) {
        throw ConflictException({ message: 'user is exest ' })
    }
   
 const acount = await create({
        data: [{
            email,
            password: await hash(password),
            userName,
            phone: await encrypt(phone)
        }],
        model: Usermodel
    })
    return acount
}
export async function signupWithGmail(idToken) {


    
 
}

export async function login({ email, password },issuer) {
    const user = await findOne({ model: Usermodel, filter: { email } })
    if (!user) {
        throw NotFoundException({ message: 'user is not round' })
    }
    const match = await compare(password, user.password)

    if (!match) {
        throw NotFoundException({ message: 'user is not round' })
    }
    user.phone = await decrypt(user.phone)
   
    
    return await creatLoginCredentials({user,issuer})

}
export async function logout() {
}