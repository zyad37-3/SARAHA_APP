import { EventEmitter } from "node:events"
import { sendEmil } from "./send.email.js"
import { verifyEmailTemplate } from "./email.templats.js"
export const emailEvent = new EventEmitter()
emailEvent.on("sendEmail", async({recipients, subject, data}) => {
    try {
      await sendEmil({
            ...recipients,
            subject,
            html: verifyEmailTemplate({code:data.code,subject,title:data.title})
        })

    } catch (error) {
        console.log(error);

    }
})