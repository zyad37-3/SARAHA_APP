import { BadRequestException } from "../common/exceptions/index.js";
import { proccesMulterUpload } from "../common/utils/index.js";

export function uploadMulterUpload({isRequired=true,multerMedelware,customPath="general", validation = [] }) {
    return async (req, res, next) => {
   //multerMedelware ==> هى (single and array and any) name=>multerMedelware
        multerMedelware(req,res,async(error)=>{
            if (error){
                next(new Error(error.message,{cause:{status:400}}))
                return;
            
            }
            try {
                if (isRequired&&
                    (!req.file&&
                    !(Array.isArray(req.files)&&req.files.lenght)&&
                !(typeof req.files =="object"&&Object.keys(req.files)?.lenght))){
                    next(BadRequestException({message:"file is required"}))
                    return;
                }
             await proccesMulterUpload({customPath, validation,req })
            next()

            } catch (error) {
              next(new Error(error.message,{cause:{status:400}}))
 
            }
        })

        
    
    }
}
