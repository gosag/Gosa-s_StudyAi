import express from "express"
import protector from "../middleware/authMiddleware";
import validate from "../schemas/validator"
import { loginSchema ,signUpSchema} from "../schemas/zodSchema";
import { rateLimiter } from "../middleware/rateLimitor";
import User from "../models/user.model";
interface RequestError extends Error{
    status?:number,
    statusCode?:number
}
import {
    registerController,
    loginController,
    getUserData,
    verificationController
} from "../controllers/auth.controller"
const authRouter=express.Router();
authRouter.post("/api/auth/verify-email",verificationController)
authRouter.post("/api/auth/register",validate(signUpSchema,"body"), registerController);
authRouter.post("/api/auth/login",rateLimiter,validate(loginSchema,"body"), loginController);
authRouter.get("/api/auth/:id",protector,getUserData);
authRouter.delete("/api/auth/Logout",async (req,res,next)=>{
    try{
    const {email}=req.body;
    const user= await User.findOne({email})
    console.log(user)
    if(!user){
        const error=new Error("user with this email is not found") as RequestError
        error.status=404;
        throw error;
    }
    const id= user._id;
    console.log(id)
    const duser= await User.findByIdAndDelete(id)
    res.status(204).json({message:`User with email ${email} is deleted.`,userInfo:duser})
}
    catch(err){
        next(err)
    }
})
export default authRouter;