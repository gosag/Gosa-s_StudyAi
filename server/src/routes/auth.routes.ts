import express from "express"
import protector from "../middleware/authMiddleware";
import validate from "../schemas/validator"
import { loginSchema ,signUpSchema} from "../schemas/zodSchema";
import {
    registerController,
    loginController,
    getUserData
} from "../controllers/auth.controller"
const authRouter=express.Router();
authRouter.post("/api/auth/register",validate(signUpSchema,"body"), registerController)
authRouter.post("/api/auth/login",validate(loginSchema,"body"), loginController)
authRouter.get("/api/auth/:id",protector,getUserData)
export default authRouter;