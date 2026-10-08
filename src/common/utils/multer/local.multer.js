import multer from "multer"
import { randomUUID } from "node:crypto"
import {  unlink,writeFile ,mkdir} from "node:fs/promises";
import { fileTypeFromBuffer } from "file-type";
import { resolve } from "node:path";
import { BadRequestException } from "../../exceptions/error.exception.js";
export const fileValidation = {
    image: [
        "image/jpeg",
        "image/png",
        "image/gif"
    ],
    files: [
        "application/pdf",
        "application/json"
    ]
}

export const localFileUpload = ({ maxFileSize = 5, validation = [] } = {}) => {
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, "./assets")
    //     },
    //     filename: function (req, file, cb) {
    //         cb(null, randomUUID() + file.originalname)
    //     }
    // })

    // function fileFilter(req, file, cb) {
    //     if (validation.includes(file.mimetype)) {
    //         //مفيش خطا وابعته
    //         cb(null, true)
    //     } else {

    //         //فيه خطا ومتبعبهوش
    //         cb(new Error("invalid format", { cause: { status: 400 } }), false)
    //     }
    // }

   const storage=multer.memoryStorage()

    return multer({  storage, limits: { fileSize: maxFileSize * 1024 * 1024 } })
}

export async function proccesFile({ customPath="general",file,validation = [] }) {
        const result = await fileTypeFromBuffer(file.buffer)
        if (!result || !validation.includes(result.mime)) {
           throw BadRequestException({message:"invalid file format"})
        }else{
            await mkdir(resolve(`assets/${customPath}`),{recursive:true})
            const uniqueFilePath=`assets/${customPath}/${randomUUID()}.${result.ext}`
            await writeFile(resolve(`./${uniqueFilePath}`),file.buffer)
            file.finalPath=uniqueFilePath
            return file
        }
    }
export async function proccesFiles({ customPath,files=[],validation = [] }) {
    const assets =[]
try {
        for (const file of files) {
           const uploadFile= await proccesFile({customPath,file,validation})
            assets.push(uploadFile)
        }
        return assets

} catch (error) {
     for (const file of assets) {
    await unlink(resolve(`./${file.finalPath}`))
}
throw BadRequestException({message:"invalid file format 1"})
}
    }
export async function proccesFields({customPath, fields={},validation = [] }) {
    const assets =[]
            for (const field of Object.keys(fields)) {
           const file= await proccesFiles({customPath,files:field[field],validation})
            assets.push({field,file})
        }
        return assets

    }

export async function proccesMulterUpload({customPath="general", validation = [] ,req}) {
    
        if (req.file){
            await proccesFile({customPath,file:req.file,validation})

        }else if(Array.isArray(req.files)){
            await proccesFiles({customPath,files:req.files,validation})

        }else if (typeof req.files =="object"&& Object.keys(req.files)?.lenght){
            await proccesFields({customPath,fields:req.fields,validation})

        }
        
    
}

























//diskStorageلمو هشتغل 
// export function proccesFile({ validation = [] }) {
//     return async (req, res, next) => {
//         const filePath = resolve(`./${req.file.path}`)
//         const filebuffer = await readFile(filePath)
//         const result = await fileTypeFromBuffer(filebuffer)
       
        
//         if (!result || !validation.includes(result.mime)) {
//             await unlink(filePath)
//             next(new Error("invalid file format", { cause: { status: 400 } }))
//         }else{

//             next()
//         }
//     }
// }