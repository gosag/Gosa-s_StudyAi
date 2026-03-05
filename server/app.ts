import express from "express"
import authRouter from "./routes/auth";
import errorHandler from "./middleware/error";
import morgan from "morgan"
import cors from "cors"
import uploadRoute from "./routes/uploads";
const app=express()
//parsers
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//logger
app.use(morgan("dev"))
//to allow only specific domains access the api
const corsOptions={
    origin:"http://localhost:5173",
    methods:["GET","POST"],
    alowedHeaders:["Content-Types","Authorization"],
    cridentials:true
}
app.use(cors(corsOptions))
//routes
app.use(uploadRoute)
app.use(authRouter)
//error handler
app.use(errorHandler)
export default app;
