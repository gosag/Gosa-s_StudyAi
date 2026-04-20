import express from "express"
import User from "../models/user.model"
import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import type { Request ,Response ,NextFunction} from "express";
import bcrypt from "bcryptjs"
import type { Types } from "mongoose";
import { Resend } from "resend"
const authRouter=express.Router();
interface RequestError extends Error{
    status?:number,
    statusCode?:number
}
const tokenGenerator=(id:Types.ObjectId)=>{
    const SECRET=process.env.SECRET!
    return jwt.sign({id:id.toString()},SECRET,{expiresIn:"30d"})
}
export const verificationController=asyncHandler(async(req:Request,res:Response,next:NextFunction)=>{
    const {email}=req.body;
    if(!email){
        const error= new Error("Email is not sent") as RequestError
        error.status=400;
        throw error;
    }
    
    const resend = new Resend(`${process.env.RESEND_API_KEY!}`);

    let randomNumber=Math.floor(Math.random()*9000)+999;
    if(randomNumber<1000){
        randomNumber+=1
    }
    console.log(randomNumber);
    const sendEmail=async()=>{
        try{
            const { data, error } = await resend.emails.send({
                from: "EchoStudy <noreply@echostudy.gosagirma.me>",
                to: email,
                subject: "Your verification Code from EchoStudy",
                text: `Your verification code is ${randomNumber}. It will expire in 5 minutes. 
                Please! Don't share this code with anyone.`,
            });

            if (error) {
                console.error("Resend API Error:", error);
                throw error;
            }

            console.log("Email sent successfully:", data);
            res.json({message:`Verification code sent to ${email}. Please check your inbox.`,code:randomNumber})
        }
        catch(err){
            console.error("Failed to send email:", err);
            next(err)
        }
    }
    await sendEmail()
})
export const resetPasswordController=asyncHandler(async(req:Request,res:Response, next:NextFunction)=>{
    const {email}=req.body;
    if(!email){
        const error= new Error("Email is not sent") as RequestError
        error.status=400;
        throw error;
    }
    const findEmail= await User.find({email})
    if(findEmail.length===0){
        const error= new Error("user with this email is not found") as RequestError
        error.status=404;
        throw error;
    }
    const resend= new Resend(`${process.env.RESEND_API_KEY!}`)
    let randomNum=Math.floor(Math.random()*9000) + 1000;
    const {data,error} = await resend.emails.send({
               from: "EchoStudy <noreply@echostudy.gosagirma.me>",
                to: email,
                subject: "Your verification Code from EchoStudy",
                text: `Your verification code is ${randomNum}. It will expire in 5 minutes. 
                Please! Don't share this code with anyone.`,
            });
    if(error){
        console.log("Resend API Error ",error)
        throw error;
    }
    console.log("Email sent Succesfully ", data)
    console.log(`Code ${randomNum}`)
    res.json({message:"verification Code is sent",code:randomNum})
})
export const updatePasswordcontroller=asyncHandler(async(req:Request, res:Response, next:NextFunction)=>{
    const {password, email}= req.body;
    if(!password || password.length<6 ){
        const error= new Error("Password is not sent! ") as RequestError;
        error.status=400;
        throw error;
    }
    if(!email){
        const error= new Error("Email is not sent! ") as RequestError;
        error.status=400;
        throw error
    }
    const user = await User.findOne({email});
    if(!user){
        throw new Error("User not found")
    }
    const id=user._id;
    const hashedPassword= await bcrypt.hash(password,10);
    const updatedUser= await User.findByIdAndUpdate(id,{password:hashedPassword})
    if(!updatedUser){
        const error= new Error("Couldn't update user info");
        throw error;
    }
    res.json({message:"Password updated succesfully"})
})
export const registerController= asyncHandler(async(req:Request,res:Response)=>{
    const {email,password}=req.body;
    const userExists=await User.findOne({email})
    if(userExists){
        const error= new Error("user with this email already exists") as RequestError;
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
})
interface userIF{
    email?:string,
    password?:string,
    _id?:Types.ObjectId 
}
export const loginController= asyncHandler(async(req:Request,res:Response)=>{
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
})

export const  getUserData= asyncHandler(async(req:Request,res:Response)=>{
const id=req.params.id;
const user=await User.findById(id)
    if(!user){
        const error=new Error("user with this id not found") as RequestError;
        error.status=404;
        throw error
    }
    res.json({user})
})