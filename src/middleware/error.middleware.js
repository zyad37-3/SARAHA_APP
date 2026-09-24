export const globalmiddeleErorr =(error,req,res,next)=>{
    return res.status(error.cause?.status ?? 500).json({ error_message: error.message || "server error", stack: error.stack,cause:error.cause })
}