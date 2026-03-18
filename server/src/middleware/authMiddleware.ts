import type {Request,Response, NextFunction } from "express"
import User from "../models/user.model";
import type { IUser } from "../models/user.model";
import jwt from "jsonwebtoken";
interface requestError extends Error{
    status?:number
}
interface JwtPayload {
    id: string;
}
interface AuthenticatedRequest extends Request {
    user?: IUser;
}
const protector=async(req:AuthenticatedRequest,res:Response,next:NextFunction)=>{
    try{
    if(!req.headers.authorization || !req.headers.authorization?.startsWith("Bearer")){
        const error=new Error("no token, not authenticated") as requestError;
        error.status=401;
        throw error
    }
    const SECRET=process.env.SECRET!
    const tokens=req.headers.authorization.split(" ")[1]!
    
    if(!tokens || tokens === "null" || tokens === "undefined"){
        const error=new Error("Invalid or missing token") as requestError;
        error.status=401;
        throw error
    }

    const decoded= jwt.verify(tokens,SECRET) as JwtPayload;
    const user=await User.findById(decoded.id).select("-password")
    if(!user){
        const error=new Error("user with this id doesn't exist") as requestError
        error.status=404;
        throw error
    }
    req.user=user as IUser;
    next();
}
catch(error: any){
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
        const jwtError = new Error("Not authenticated, invalid or expired token") as requestError;
        jwtError.status = 401;
        return next(jwtError);
    }
    next(error);
}
}
export default protector;