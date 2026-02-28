import {z} from "zod";
export const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6,"at least 6 characters are required")
})
export const signUpSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6,"a password with at least 6 char is required"),
    confirmPassword:z.string().min(6,"a password with at least 6 char is required")
})