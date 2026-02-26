import type {Request,Response, NextFunction } from "express"
import User from "../models/userSchema";
import jwt from "jsonwebtoken";
interface requestError extends Error{
    status?:number
}
interface JwtPayload {
    id: string;
}
const protector=async(req:Request,res:Response,next:NextFunction)=>{
    try{
    if(!req.headers.authorization || !req.headers.authorization?.startsWith("Bearel")){
        const error=new Error("no token, not authenticated") as requestError;
        error.status=401;
        throw error
    }
    const SECRET=process.env.SECRET!
    const tokens=req.headers.authorization.split(" ")[1]!
    const decoded= jwt.verify(tokens,SECRET) as JwtPayload;
    const user=await User.findById(decoded.id).select("-password")
    if(!user){
        const error=new Error("user with this id doesn't exist") as requestError
        error.status=404;
        throw error
    }
    req.user=user;
    next()
}
catch(error){
        next(error)
    }
}
export default protector;