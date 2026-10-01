import  express from "express"
import { globalmiddeleErorr } from "./middleware/index.js"
import { PORT } from "./config.js"
import { bootstrapDB } from "./db/connection.js"
import { athenticationController } from "./module/athentication/index.js"
import cors from "cors";
import { userController } from "./module/user/index.js"


const app =express()
await bootstrapDB(app,PORT)
app.use(express.json())


app.use(cors());
app.use("./",(req,res,next)=>{res.json("hello world 👍")})

app.use("/auth",athenticationController)
app.use("/user",userController)






app.use(globalmiddeleErorr)
app.all("{./*dummy}",(req,res,next)=>{res.json( {message: "is not find 🔴"})})
