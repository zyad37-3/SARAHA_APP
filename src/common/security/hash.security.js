import bcrypt from 'bcrypt';
export const hash = async (myPlaintext, round = 12, minor = `b`) => {
    const salt = await bcrypt.genSalt(round, minor)
    return await bcrypt.hash(myPlaintext, salt)
}
export const compare = async (myPlaintext, cipherText) => {
    return await bcrypt.compare(myPlaintext, cipherText)
}
