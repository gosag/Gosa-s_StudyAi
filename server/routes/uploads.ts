import express from "express";
import Material from "../models/materialSchema";
import Chat from "../models/chatSchema";
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
        res.json({ response, materialId:newMatrial._id });
    }
    catch(error){
        const customError = error as CustomError;
        if (customError.status) {
            return next(customError);
        }
        else{
            const err = new Error("Failed to process request: " + (error instanceof Error ? error.message : "Unknown error")) as CustomError;
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
    res.json({ transcript, response: sumamrizedResponse ,MaterialId:newMatrial._id});
    console.log(`[SUCCESS] Transcript sent to EchoLearn frontend.`);
  } catch (err: any) {
    return next(err);
  }
});
uploadRoute.post("/api/continue",protector, async(req,res,next)=>{
    const {materialId,userMessage}=req.body
    const material=await Material.findById(materialId)
    if(!material){
        const error=new Error("Material not found") as CustomError
        error.status=404
        return next(error)
    }
    if(!req.user || !req.user._id){
      const error=new Error("User information is missing") as CustomError
      error.status=401;
      throw error
    }
    const newChat= new Chat({
      userId:req.user._id,
      materialId,
      message:[{
        role:"user",
        text:userMessage,
      }]
    })
    await newChat.save();
   const messages=await Chat.find({materialId}).sort({ timeStamp: 1 })
   const systemMessage=messages.map(mssg=>(
    {
        role:mssg?.message?.[0]?.role || "user",
        content:mssg?.message?.[0]?.text || ""
    }
   ))
    const conversationHistory:{role: string; content: string}[] = [
        { role: "system", content: "You are a helpful assistant that provides information based on the provided material." },
        { role: "user", content: `Here is the material for reference: ${material.summary}` },
    ];
    conversationHistory.push(...systemMessage);
    const prompt = conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    const response = await generateResponse(prompt);
    const newAIChat = new Chat({
      userId:req.user._id,
      materialId,
      message:[
        {
          role:"model",
          text:response,
        }
      ]
    })
    await newAIChat.save();
    res.json({ response });
})
uploadRoute.get("/api/materials",protector,async(req,res,next)=>{
   try{
    if(!req.user || !req.user._id){
      const error= new Error("Missing user information") as CustomError;
      error.status=401;
      throw error
    }
    const materials=await Material.find({userId:req.user._id}).sort({timestamps:-1})
    console.log(`[Echo Learn] Retrieved ${materials.length} materials for user ${req.user._id}`);
    res.json({ materials });
   } catch(error){
    next(error);
   }
})
uploadRoute.delete("/api/delete",protector,async(req,res,next)=>{
  try{
    const {materialId}=req.body;
    const deletedMaterial=await Material.findByIdAndDelete(materialId);
    if(!deletedMaterial){
      const error=new Error("something went wrong deleting the material") as CustomError
      error.status=500;
      throw error
    }
    res.json({message:"material is deleted"})
  }catch(err){
    next(err)
  }
})
uploadRoute.get("/api/materials/:id",protector,async(req,res,next)=>{
  try{
    const {id}=req.params;
    if(!id){
      const error=new Error("Material ID is required") as CustomError
      error.status=400;
      throw error
    }
    const material=await Material.findById(id);
    if(!material){
      const error=new Error("Material not found") as CustomError
      error.status=404;
      throw error;
    }
    const chats=await Chat.find({materialId:id}).sort({timeStamp:1})
    res.json({ material, chats });
  }catch(error){
    next(error);
  }
})
export default uploadRoute;