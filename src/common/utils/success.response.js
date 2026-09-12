export const successResponse =({res,data=undefined,message="Done",status=200}={})=>{
  return  res.status(status).json({message,data})
}


