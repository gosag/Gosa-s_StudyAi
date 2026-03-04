import express from "express"
import multer from "multer"
const uploadRoute=express.Router();
const upload=multer({dest:"uploads/",
    limits:{fileSize:10*1024*1024},
    fileFilter:(req,file,cb)=>{
        if(file.mimetype!=="application/pdf"){
            return cb(new Error("Only PDF files are allowed"))
        }        cb(null,false)      
}});
uploadRoute.post("/api/uploads",upload.single("pdf"),(req,res)=>{
    if(!req.file){
        return res.status(400).json({error:"No file uploaded"})
    }
    console.log(req.file)
    res.send("file Sent")
})
export default uploadRoute;