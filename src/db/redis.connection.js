import { createClient } from "redis"
import { RADIS_URI } from "../config.js";

export const client = createClient({
  url: RADIS_URI
});

export async function connectRadis(){
    try {
      await client.connect()
      console.log("Radis connection stablish successfully ");
       
    } catch (error) {
              console.log("Fail to  stablish Radis connection ");

    }
 
}