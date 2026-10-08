import  express from "express"
import { globalmiddeleErorr } from "./middleware/index.js"
import { PORT } from "./config.js"
import { bootstrapDB } from "./db/connection.js"
import { athenticationController } from "./module/athentication/index.js"
import cors from "cors";
import { userController } from "./module/user/index.js"
import { sendEmil } from "./common/utils/email/index.js"
import { resolve } from "node:path"


const app =express()
await bootstrapDB(app,PORT)
app.use(cors(),express.json())

//URLمتاح للمتصفح عن طريق assetsمعناه إنك بتخلي فولدر
app.use("/assets",express.static("./assets"))


app.all("/",(req,res,next)=>{res.json("hello world 👍")})


app.use("/auth",athenticationController)
app.use("/user",userController)





app.all("{./*dummy}",(req,res,next)=>{res.json( {message: "is not find 🔴"})})
app.use(globalmiddeleErorr)
