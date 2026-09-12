import  express from "express"
import { globalmiddeleErorr } from "./middleware/index.js"
import { PORT } from "./config.js"
import { bootstrapDB } from "./db/connection.js"
import { athenticationController } from "./module/athentication/index.js"

const app =express()
app.use(express.json())
bootstrapDB(app,PORT)
app.use("./",(req,res,next)=>{res.json("hello world 👍")})

app.use("/auth",athenticationController)






app.use(globalmiddeleErorr)
app.all("{./*dummy}",(req,res,next)=>{res.json( {message: "is not find 🔴"})})
