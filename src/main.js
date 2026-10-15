import express from "express"
import { globalmiddeleErorr } from "./middleware/index.js"
import { ORIGIN, PORT } from "./config.js"
import { bootstrapDB } from "./db/connection.js"
import cors from "cors";
import { messageController, athenticationController, userController, identityRequestController, conversationMessageController } from "./module/index.js"
import helmet from "helmet";
import { generateRateLimiter } from "./common/utils/limiters.js";
import morgan from "morgan";
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (ORIGIN.includes(origin)){
//         callback(new Error("unauthorized origin",{cause:{status:401}}),ORIGIN)
//     }else{
//         callback(null,ORIGIN)
//     }
//   }
// }
const app = express()
await bootstrapDB(app, PORT)


//true=>معناها فاتحها لكل/ api/ده مهم بيحدد ال
app.set("trust proxy", true)
const limiter = generateRateLimiter({ limit: 1000 })
app.use(helmet(), cors(),morgan("dev"), express.json(), limiter)

//URLمتاح للمتصفح عن طريق assetsمعناه إنك بتخلي فولدر
app.use("/assets", express.static("./assets"))


app.all("/", (req, res, next) => { res.json("hello world 👍") })


app.use("/auth", athenticationController)
app.use("/user", userController)
app.use("/message", messageController)
app.use("/conversationMessage", conversationMessageController)
app.use("/identityRequest", identityRequestController)





app.all("{./*dummy}", (req, res, next) => { res.json({ message: "is not find 🔴" }) })
app.use(globalmiddeleErorr)
