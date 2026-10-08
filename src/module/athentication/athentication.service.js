import e from "express";
import { ConflictException, NotFoundException, ToManyRequestException } from "../../common/exceptions/index.js";
import { creatLoginCredentials, decrypt, encrypt, userBaseRevokeTokenKey } from "../../common/security/index.js";
import { compare, hash } from "../../common/security/index.js";
import { createToken } from "../../common/security/index.js";
import { Usermodel } from "../../db/model/index.js";
import { create, findOne } from './../../common/respository/index.js';
import { emailEvent, userEmailKey, userEmailTrialsKey } from "../../common/utils/email/index.js";
import { EmailSubjectEnum } from "../../common/enum/index.js";
import { creatOtp } from "../../common/utils/index.js";
import { del, expire, get, incrBy, keys, set, ttl } from "../../common/services/cache.service.js";
async function sendEmailOtp({mess, email,subject, expiresIn = 120, maxTrials = 3, blockInSeconds = 300 }) {
    //300==>5 minutes
    const existOtp_TTl = await ttl({ key: userEmailKey({ email, subject:subject }) })
    if (existOtp_TTl > 0) {
        throw ConflictException({ message: `sorry we cannot creat now otp while existed one still valid please try again later after ${existOtp_TTl}s` })
    }
    const oldTrials = await get({ key: userEmailTrialsKey({ email, subject:subject }) }) ?? 0
    if (oldTrials >= maxTrials) {
        throw ToManyRequestException({ message: "many otp Trials has been reached" })
    }

    const code = creatOtp()
    await set({
        key: userEmailKey({ email, subject:subject }),
        value: await hash(code.toString()),
        ttl: expiresIn
    })

    const currentTrials = await incrBy({ key: userEmailTrialsKey({ email, subject:subject }) })
    if (currentTrials == 3) {
        await expire({ key: userEmailTrialsKey({ email, subject:subject }), ttl: blockInSeconds })
    }

    emailEvent.emit("sendEmail", { recipients: { to: email }, subject:subject, data: { code: code, title: mess } })

}










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


    await sendEmailOtp({ mess:"Confirm your email",email, subject: EmailSubjectEnum.CONFIRM_EMAIL })
    return acount
}

export async function confirmEmail({ email, otp }) {
    const user = await findOne({ model: Usermodel, filter: { email: email, confirmEmail: { $exists: false } } })
    if (!user) {
        throw NotFoundException({ message: 'invalid account ' })
    }
    const otpHach = await get({ key: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) })

    if (!otpHach || !await compare(otp, otpHach)) {
        throw ConflictException({ message: 'invalid otp ' })
    }

    user.confirmEmail = new Date()
    await user.save()
    await del({ key: await keys({ key: userEmailKey({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL }) }) })
    return;

}
export async function resendConfirmEmail({ email }) {
    const user = await findOne({ model: Usermodel, filter: { email: email, confirmEmail: { $exists: false } } })
    if (!user) {
        throw NotFoundException({ message: 'invalid account ' })
    }
    await sendEmailOtp({ email, subject: EmailSubjectEnum.CONFIRM_EMAIL })

    return;

}

export async function requestForgotPasswordCode({ email }) {
    const user = await findOne({ model: Usermodel, filter: { email: email, confirmEmail: { $exists: true } } })
    if (!user) {
        throw NotFoundException({ message: 'invalid account ' })
    }
    await sendEmailOtp({mess:"Confirm your password" ,email, subject: EmailSubjectEnum.FORGOT_PASSWORD })

    return;

}
export async function verifyForgotPassword({ email, otp }) {
    const user = await findOne({ model: Usermodel, filter: { email: email, confirmEmail: { $exists: true } } })
    if (!user) {
        throw NotFoundException({ message: 'invalid account ' })
    }
    const otpHach = await get({ key: userEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }) })

    if (!otpHach || !await compare(otp, otpHach)) {
        throw ConflictException({ message: 'invalid otp ' })
    }

    return user;

}
export async function resetForgotPassword({ email, otp, password }) {
    const user = await verifyForgotPassword({ email, otp })
    user.password =await hash(password)
    user.changeCredetialsTime = new Date()
    user.save()

    //performens عشان يشتغلو مع بعض فى نفس الوقت وده احسن فى    
    const result = await Promise.all([
         keys({ key: userEmailKey({ email, subject: EmailSubjectEnum.FORGOT_PASSWORD }) }),
        keys({ key: userBaseRevokeTokenKey({ userId: user._id }) }) 
    ])

    await del({ key: [...result[0], ...result[1]] })


    return ;

}

export async function signupWithGmail(idToken) {




}

export async function login({ email, password }, issuer) {
    const user = await findOne({ model: Usermodel, filter: { email, confirmEmail: { $exists: true } } })
    if (!user) {
        throw NotFoundException({ message: 'user is not found' })
    }
    const match = await compare(password, user.password)

    if (!match) {
        throw NotFoundException({ message: 'user is not found' })
    }
    user.phone = await decrypt(user.phone)


    return await creatLoginCredentials({ user, issuer })

}
