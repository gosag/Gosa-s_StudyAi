import express from "express";
import multer from "multer";
import extractTextFromFile from "../sevices/pdf.service";
import { getYoutubeTranscript } from "../sevices/youtube.service";
const uploadRoute = express.Router();
// Existing PDF Logic...
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
uploadRoute.post("/api/uploads/link", async (req, res): Promise<any> => {
  const { link } = req.body;
  console.log(`\n[API CALL] /api/uploads/link received URL: ${link}`);

  if (!link) return res.status(400).json({ error: "No link provided" });

  try {
    const transcript = await getYoutubeTranscript(link);
    if (!transcript || transcript.length < 10) {
      return res.status(404).json({ error: "Transcript was empty or too short." });
    }

    res.json({ transcript });
    console.log(`[SUCCESS] Transcript sent to EchoLearn frontend.`);
  } catch (err: any) {
    console.error(`[SERVER ERROR]:`, err);
    res.status(500).json({ 
      error: "Transcript failed", 
      details: err.message || err 
    });
  }
});

export default uploadRoute;