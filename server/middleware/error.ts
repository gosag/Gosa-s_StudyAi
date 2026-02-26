import type {Request,Response,NextFunction} from "express"
interface requestError extends Error{
    status?:number,
    statusCode?:number
}
const errorHandler=(err:requestError,req:Request,res:Response,next:NextFunction)=>{
    const status=err.status || err.statusCode || 500
    if(status!==500){
        return res.status(status).json({message:err.message})
    }
    if(err.name==="CastError"){
        return res.status(400).json({message:"Wrong document Id"})
    }
    if(err.name==="ValidationError"){
        return res.status(409).json({error:err.message})
    }
}
export default errorHandler;