import express from "express"
import multer from "multer"
const uploadRoute=express.Router();
const upload=multer({dest:"/uploads"});
uploadRoute.post("/api/uploads",upload.single("pdf"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:"No file uploaded"})
    }
    console.log(req.file)
    res.send("file Sent")
})
export default uploadRoute;