import { ConflictException, NotFoundException } from "../../common/exceptions/index.js";
import { decrypt, encrypt } from "../../common/security/encryption,security.js";
import { compare, hash } from "../../common/security/index.js";
import { Usermodel } from "../../db/model/index.js";
import { create, findOne } from './../../common/respository/db.respository.js';

export async function signup({ email, password, userName, phone }) {
    const user = await findOne({ model: Usermodel, filter: { email: email } })
    if (user) {
        throw ConflictException({ message: 'user is exest ' })
    }
    console.log(password);


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

export async function login({ email, password }) {
    const user = await findOne({ model: Usermodel, filter: { email } })
    if (!user) {
        throw NotFoundException({ message: 'user is not round' })
    }
    const match = await compare(password, user.password)

    if (!match) {
        throw NotFoundException({ message: 'user is not round' })
    }
    user.phone = await decrypt(user.phone)
    return user
}