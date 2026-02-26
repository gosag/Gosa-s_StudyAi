import express from "express"
import User from "../models/userSchema"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import type { Request ,Response ,NextFunction} from "express";
import bcrypt from "bcryptjs"
import type { Types } from "mongoose";
const authRouter=express.Router();
interface RequestError extends Error{
    status?:number,
    statusCode?:number
}
const tokenGenerator=(id:Types.ObjectId)=>{
    const SECRET=process.env.SECRET!
    return jwt.sign({id:id.toString()},SECRET,{expiresIn:"30d"})
}
authRouter.post("/api/auth/register",asyncHandler(async(req:Request,res:Response)=>{
    const {email,password,savedMaterials}=req.body;
    const userExists=await User.findOne({email})
    if(userExists){
        const error= new Error("user withthis email already exists") as RequestError;
        error.status=409;
        throw error;
    }
    const hashedPassword=await bcrypt.hash(password,10)
    const user=new User({
        email,
        password:hashedPassword,
        savedMaterials
    })
    await user.save()
    if(!user){
        const error=new Error("user failed to be created") as RequestError
        error.status=400;
        throw error
    }
    res.json(user)
}))
authRouter.post("api/auth/login",asyncHandler(async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email:email});
    const userPassword=user?.password!
    const isMatch=await bcrypt.compare(password,userPassword)
    if(!user || !isMatch){
        const error=new Error("user with this email not found") as RequestError;
        error.status=404;
        throw error
    }

    res.json({user,token:tokenGenerator(user._id)})
}))
authRouter.get("/api/auth/me",asyncHandler(async(req:Request,res:Response)=>{
 const {email}=req.body
 const user=await User.findOne({email})
    if(!user){
        const error=new Error("user with this email not found") as RequestError;
        error.status=404;
        throw error
    }
    res.json({user})
}))
export default authRouter;