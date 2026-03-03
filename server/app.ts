import express from "express"
import authRouter from "./routes/auth";
import errorHandler from "./middleware/error";
import morgan from "morgan"
import cors from "cors"
import multer from "multer"

const app=express()
const upload=multer({dest:"uploads/"})
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
app.post("/api/uploads",upload.single("pdf"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:"No file uploaded"})
    }
    console.log(req.file)
    res.send("file Sent")
})
app.use(authRouter)
//error handler
app.use(errorHandler)
export default app;
