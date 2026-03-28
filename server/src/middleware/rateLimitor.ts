import rateLimit from "express-rate-limit";
export const rateLimiter=rateLimit({
    windowMs:15*60*1000,
    max:3,
    message:"Too many Request try after 15 minutes!",
    standardHeaders:true,
    legacyHeaders:false
})