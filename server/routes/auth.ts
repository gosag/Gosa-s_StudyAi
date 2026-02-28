import express from "express"
import User from "../models/userSchema"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import type { Request ,Response ,NextFunction} from "express";
import bcrypt from "bcryptjs"
import type { Types } from "mongoose";
import protector from "../middleware/authMiddleware";
import validate from "../middleware/validator"
import { loginSchema ,signUpSchema} from "../models/zodSchema";
const authRouter=express.Router();
interface RequestError extends Error{
    status?:number,
    statusCode?:number
}
const tokenGenerator=(id:Types.ObjectId)=>{
    const SECRET=process.env.SECRET!
    return jwt.sign({id:id.toString()},SECRET,{expiresIn:"30d"})
}
authRouter.post("/api/auth/register",validate(signUpSchema,"body"),asyncHandler(async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    const userExists=await User.findOne({email})
    if(userExists){
        const error= new Error("user withthis email already exists") as RequestError;
        error.status=409;
        throw error;
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const user=new User({
        email,
        password:hashedPassword
    })
    await user.save()
    if(!user){
        const error=new Error("user failed to be created") as RequestError
        error.status=400;
        throw error
    }
    res.json({user})
}))
interface userIF{
    email?:string,
    password?:string,
    _id?:Types.ObjectId 
}
authRouter.post("/api/auth/login",validate(loginSchema,"body"),asyncHandler(async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email}) as userIF;
    if(!user){
        const error=new Error("user with this email is not found") as RequestError
        error.status=404;
        throw error;
    }
    const isMatch=await bcrypt.compare(password,user.password!)
    if(!isMatch){
        const error=new Error("password doesn't match") as RequestError;
        error.status=401;
        throw error
    }
    const id=user._id;
    if(!id){
        return 
    }
    res.json({user,token:tokenGenerator(id)})
}))
authRouter.get("/api/auth/:id",protector,asyncHandler(async(req:Request,res:Response)=>{
const id=req.params.id;
const user=await User.findById(id)
    if(!user){
        const error=new Error("user with this id not found") as RequestError;
        error.status=404;
        throw error
    }
    res.json({user})
}))
export default authRouter;