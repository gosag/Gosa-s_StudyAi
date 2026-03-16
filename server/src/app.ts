import express from "express"
import authRouter from "./routes/auth.routes";
import errorHandler from "./middleware/error";
import morgan from "morgan"
import cors from "cors"
import uploadRoute from "./routes/upload.routes";
const app=express()
//parsers
app.use(express.json());
app.use(express.urlencoded({extended:true}));
//logger
app.use(morgan("dev"))

// normalize duplicate slashes in the URL
app.use((req, res, next) => {
    req.url = req.url.replace(/\/{2,}/g, '/');
    next();
});

//to allow only specific domains access the api
const corsOptions={
    origin: ["https://gosa-s-study-ai-git-main-gosa-girmas-projects.vercel.app", "https://gosa-s-study-ai.vercel.app","http://localhost:5173"],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
    credentials:true
}
app.use(cors(corsOptions))
//routes
app.use(uploadRoute)
app.use(authRouter)
app.get("/",(req,res)=>{
    res.send("Welcome to EchoLearn API")
})
//error handler
app.use(errorHandler)
export default app;
