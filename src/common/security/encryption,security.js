import crypto from 'node:crypto'
import { ENC_KEY, IV_LENGTH } from '../../config.js';
const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);
// env/عشان اجيب 32 رقم ثم اخزنو فى 
// console.log(crypto.randomBytes(16).toString("hex"));

export const encrypt = async (text) => {
    const iv=crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(algorithm, ENC_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return  `${iv.toString('hex')}::${encrypted}`
};


export const decrypt =async (cipherText) => {
const [iv,encrypted]=cipherText.split("::")
const iv_Vector = Buffer.from(iv, 'hex');
 const decipherVector = crypto.createDecipheriv(
        algorithm,
        ENC_KEY,
        iv_Vector
    );
     let plainText = decipherVector.update(
        encrypted,
        'hex',
        'utf8'
    );
  plainText += decipherVector.final('utf8');
  return plainText;
};
