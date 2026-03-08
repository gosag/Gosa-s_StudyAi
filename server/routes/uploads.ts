import express from "express";
import Material from "../models/materialSchema";
import multer from "multer";
import extractTextFromFile from "../sevices/pdf.service";
import { getYoutubeTranscript } from "../sevices/youtube.service";
import { generateResponse } from "../sevices/gemini.service";
import protector from "../middleware/authMiddleware";
interface CustomError extends Error {
  status?: number,
  statusCode?: number
}
const uploadRoute = express.Router();
// Existing PDF Logic...
const upload=multer({storage:multer.memoryStorage(),
    limits:{fileSize:15*1024*1024},
    fileFilter:(req,file,cb)=>{
        if(file.mimetype!=="application/pdf"){
            return cb(new Error("Only PDF files are allowed"))
        }
        cb(null,true)      
}});
uploadRoute.post("/api/uploads/file",protector, upload.single("pdf"),async (req,res,next)=>{
    if(!req.file){
      const error=new Error("No file uploaded") as CustomError
      error.status=400
      return next(error)
    }
    console.log(req.file)
    try{
        const extractedText = await extractTextFromFile(req.file.buffer);
        console.log(`Extracted text length: ${extractedText.text.length} characters`);
        const response = await generateResponse(`Hey Gemini, summarize the following text in a concise manner: ${extractedText.text}`);
        console.log(`[Gemini Summary] ${response.length} characters`);
        if (!req.user || !req.user._id) {
          const error = new Error("User information is missing") as CustomError;
          error.status = 401;
          return next(error);
        }
        const newMatrial=new Material({
          materialType:"file",
          title:req.file.originalname,
          originalText:extractedText.text,
          userId:req.user._id,
          summary:response,
        })
        await newMatrial.save();
        res.json({ response });

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
uploadRoute.post("/api/uploads/link",protector, async (req, res,next): Promise<any> => {
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
    const sumamrizedResponse = await generateResponse(`Hey Gemini, summarize the following YouTube transcript in a concise manner: ${transcript}`);
    if(sumamrizedResponse.length){
        console.log("[Echo Learn] Transcript Summarized")
    }
    if(!req.user || !req.user._id){
      const error=new Error("User information is missing") as CustomError
      error.status=401;
      throw error
    }
    const newMatrial= new Material({
        materialType:"link",
        title:"youtube link",
        originalText:transcript,
        summary:sumamrizedResponse,
        userId:req.user._id
    })
    await newMatrial.save();
    if(!newMatrial){
      console.log("[Echo Learn] Failed to save material to database")
      const error=new Error("Failed to save material to database") as CustomError
      error.status=500;
      throw error;
    }
    res.json({ transcript, response: sumamrizedResponse });
    console.log(`[SUCCESS] Transcript sent to EchoLearn frontend.`);
  } catch (err: any) {
    return next(err);
  }
});
uploadRoute.get("/api/uploads/test", async(req, res,next) => {
  try{
  const response = await generateResponse("Hello, Gemini. this is the first prompt of mine with u.just say  something or tell me a joke yeah yeah tell me a joke that u are sure will make me laugh in amharic ");
  console.log(`[Gemini Test] Response: ${response}`);
  res.json({ message: "Upload route is working!",response });
  }catch(error){
    console.log(error);
    next(error)
  }
});
export default uploadRoute;