import express from "express";
import multer from "multer";
import extractTextFromFile from "../sevices/pdf.service";
import { getYoutubeTranscript } from "../sevices/youtube.service";
interface CustomError extends Error {
  status?: number,
  statusCode?: number
}
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
uploadRoute.post("/api/uploads/file",upload.single("pdf"),async (req,res,next)=>{
    if(!req.file){
      const error=new Error("No file uploaded") as CustomError
      error.status=400
      return next(error)
    }
    console.log(req.file)
    try{
        const extractedText=await extractTextFromFile(req.file.buffer)
        res.json(extractedText)
    }
    catch(error){
        const customError = error as CustomError;
        if (customError.status) {
            return next(customError);
        }
        else{
            const err = new Error("Failed to extract text from file") as CustomError;
            err.status = 500;
            return next(err);
        }
    }
})
uploadRoute.post("/api/uploads/link", async (req, res,next): Promise<any> => {
  const { link } = req.body;
  console.log(`\n[API CALL] /api/uploads/link received URL: ${link}`);

  if (!link){
    const error=new Error("No link provided") as CustomError
    error.status=400
    return next(error)
  }
  try {
    const transcript = await getYoutubeTranscript(link);
    if (!transcript || transcript.length < 10) {
      const error=new Error("Transcript was empty or too short.") as CustomError
      error.status=404
      return next(error)
    }

    res.json({ transcript });
    console.log(`[SUCCESS] Transcript sent to EchoLearn frontend.`);
  } catch (err: any) {
    return next(err);
  }
});

export default uploadRoute;