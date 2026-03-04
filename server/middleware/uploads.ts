import express from "express"
import multer from "multer"
import * as youtubeTranscript from "youtube-transcript-api";
import extractTextFromFile from "../sevices/pdf.service";
const uploadRoute=express.Router();
const upload=multer({storage:multer.memoryStorage(),
    limits:{fileSize:10*1024*1024},
    fileFilter:(req,file,cb)=>{
        if(file.mimetype!=="application/pdf"){
            return cb(new Error("Only PDF files are allowed"))
        }
        cb(null,true)      
}});
uploadRoute.post("/api/uploads/file",upload.single("pdf"),async (req,res)=>{
    if(!req.file){
        return res.status(400).json({error:"No file uploaded"})
    }
    console.log(req.file)
    try{
        const extractedText=await extractTextFromFile(req.file.buffer)
        res.json(extractedText)
    }
    catch(error){
        res.status(500).json({error:"Failed to extract text from file"})
    }
})
uploadRoute.post("/api/uploads/link",async (req,res)=>{
    const {link}=req.body;
    if(!link){
        return res.status(400).json({error:"No link provided"})
    }
    try {
        console.log("Fetching transcript for link:", link)
        const transcript = await youtubeTranscript.getTranscript(link)
        res.json({ transcript })
        console.log(transcript)
    } catch (error) {
        console.error("Youtube transcript error:", error);
        res.status(500).json({ error: "Failed to fetch transcript" })
    }
})
export default uploadRoute;