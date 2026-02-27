import express from "express"
import authRouter from "./routes/auth";
import errorHandler from "./middleware/error";
import morgan from "morgan"
const app=express()
//parsers
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//logger
app.use(morgan("dev"))
//routes
app.use(authRouter)
//error handler
app.use(errorHandler)
export default app;
