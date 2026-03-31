import rateLimit from "express-rate-limit";
export const rateLimiter=rateLimit({
    windowMs:5*60*1000,
    max:6,
    message:"Too many Request try after 5 minutes!",
    standardHeaders:true,
    legacyHeaders:false
})
export const transcriptLimiter=rateLimit({
    windowMs:1*60*1000,
    max:1,
    message:"Please! try after a minute.",
    standardHeaders:true,
    legacyHeaders:false
})