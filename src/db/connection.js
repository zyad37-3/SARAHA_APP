import mongoose from "mongoose"
import { DB_URI } from "../config.js";
import { Usermodel } from "./model/index.js";
import { connectRadis } from "./redis.connection.js";

export const bootstrapDB = async (app, port) => {
    try {

        await mongoose.connect(DB_URI)
        await Usermodel.syncIndexes()
        console.log('succsessfully your connction ✔✔');
        await connectRadis()
        app.listen(port, (req, res, next) => { console.log(`Connected as a server 👌 .. ${port}`); })

    } catch (error) {
        console.log(error);

        console.log('faild your connction ❌');

    }
}