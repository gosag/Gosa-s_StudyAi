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
    verificationController,
    resetPasswordController,
    updatePasswordcontroller
} from "../controllers/auth.controller"
const authRouter=express.Router();
authRouter.post("/api/auth/verify-email",verificationController)
authRouter.post("/api/auth/register",validate(signUpSchema,"body"), registerController);
authRouter.post("/api/auth/login",rateLimiter,validate(loginSchema,"body"), loginController);
authRouter.post("/api/auth/pass-reset",rateLimiter,resetPasswordController);
authRouter.patch("/api/auth/pass-update",rateLimiter,updatePasswordcontroller);
authRouter.get("/api/auth/:id",protector,getUserData);
export default authRouter;