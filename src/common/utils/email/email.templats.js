
import { EmailSubjectEnum } from './../../enum/email.enum.js';


const templates = {
   [ EmailSubjectEnum.CONFIRM_EMAIL]:(data)=> {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirm your email</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f7fb;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            ">

                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    padding: 30px;
                    text-align: center;
                    color: white;
                ">
                    <h1 style="
                        margin: 0;
                        font-size: 30px;
                    ">
                        SarahaApp
                    </h1>

                    <p style="
                        margin: 8px 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                    ">
                        Speak freely. Connect honestly.
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 35px;">

                    <h2 style="
                        margin-top: 0;
                        color: #1f2937;
                    ">
                        ${data.title}✉️
                    </h2>

                    <p style="
                        color: #6b7280;
                        line-height: 1.7;
                        font-size: 15px;
                    ">
                        Welcome to SarahaApp!
                        Use the verification code below to confirm
                        your email address and activate your account.
                    </p>

                    <!-- OTP -->
                    <div style="
                        margin: 30px 0;
                        padding: 20px;
                        background: #f5f3ff;
                        border: 1px solid #ddd6fe;
                        border-radius: 12px;
                        text-align: center;
                    ">

                        <p style="
                            margin: 0 0 10px;
                            color: #6b7280;
                            font-size: 13px;
                        ">
                            Your verification code
                        </p>

                        <div style="
                            font-size: 34px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #6366f1;
                        ">
                            ${data.code}
                        </div>

                    </div>

                    <p style="
                        color: #9ca3af;
                        font-size: 13px;
                        line-height: 1.6;
                    ">
                        If you didn't create a SarahaApp account,
                        you can safely ignore this email.
                    </p>

                </div>

                <!-- Footer -->
                <div style="
                    padding: 20px;
                    background: #f9fafb;
                    text-align: center;
                    border-top: 1px solid #eee;
                ">

                    <p style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 12px;
                    ">
                        © ${new Date().getFullYear()} SarahaApp.
                        All rights reserved.
                    </p>

                </div>

            </div>

        </body>
        </html>
    `

},
   [ EmailSubjectEnum.FORGOT_PASSWORD]:(data)=> {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>donfirm your password</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f7fb;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 8px 30px rgba(0,0,0,0.08);
            ">

                <!-- Header -->
                <div style="
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    padding: 30px;
                    text-align: center;
                    color: white;
                ">
                    <h1 style="
                        margin: 0;
                        font-size: 30px;
                    ">
                        SarahaApp
                    </h1>

                    <p style="
                        margin: 8px 0 0;
                        font-size: 14px;
                        opacity: 0.9;
                    ">
                        Speak freely. Connect honestly.
                    </p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 35px;">

                    <h2 style="
                        margin-top: 0;
                        color: #1f2937;
                    ">
                        ${data.title} ✉️
                    </h2>

                    <p style="
                        color: #6b7280;
                        line-height: 1.7;
                        font-size: 15px;
                    ">
                        Welcome to SarahaApp!
                        Use the verification code below to confirm
                        your email address and activate your account.
                    </p>

                    <!-- OTP -->
                    <div style="
                        margin: 30px 0;
                        padding: 20px;
                        background: #f5f3ff;
                        border: 1px solid #ddd6fe;
                        border-radius: 12px;
                        text-align: center;
                    ">

                        <p style="
                            margin: 0 0 10px;
                            color: #6b7280;
                            font-size: 13px;
                        ">
                            Your verification code
                        </p>

                        <div style="
                            font-size: 34px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            color: #6366f1;
                        ">
                            ${data.code}
                        </div>

                    </div>

                    <p style="
                        color: #9ca3af;
                        font-size: 13px;
                        line-height: 1.6;
                    ">
                        If you didn't create a SarahaApp account,
                        you can safely ignore this email.
                    </p>

                </div>

                <!-- Footer -->
                <div style="
                    padding: 20px;
                    background: #f9fafb;
                    text-align: center;
                    border-top: 1px solid #eee;
                ">

                    <p style="
                        margin: 0;
                        color: #9ca3af;
                        font-size: 12px;
                    ">
                        © ${new Date().getFullYear()} SarahaApp.
                        All rights reserved.
                    </p>

                </div>

            </div>

        </body>
        </html>
    `

},
}


export const verifyEmailTemplate = (data) => {
    return templates[data.subject](data)
}