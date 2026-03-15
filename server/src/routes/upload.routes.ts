import express from "express"
import multer from "multer";
import protector from "../middleware/authMiddleware";
import {uploadFile, 
        uploadLink, 
        continueConversation, 
        getUserMaterials, 
        deleteMaterial, 
        getMaterialById, 
        generateQuizzes, 
        regenerateQuizzesAsync, 
        getFlashcardsForReview, 
        updateFlashcardReview,
        getUserStreak,
        uploadReminderSettings
      } from "../controllers/upload.controller";
const uploadRoute = express.Router();
const upload=multer({storage:multer.memoryStorage(),
    limits:{fileSize:15*1024*1024},
    fileFilter:(req,file,cb)=>{
        if(file.mimetype!=="application/pdf"){
            return cb(new Error("Only PDF files are allowed"))
        }
        cb(null,true)      
}});
uploadRoute.post("/api/uploads/file",protector, upload.single("pdf"), uploadFile)
uploadRoute.post("/api/uploads/link",protector, uploadLink);
uploadRoute.post("/api/continue",protector, continueConversation)
uploadRoute.get("/api/materials",protector, getUserMaterials)
uploadRoute.delete("/api/delete/:id",protector,deleteMaterial)
uploadRoute.get("/api/materials/:id",protector, getMaterialById)
uploadRoute.get("/api/quizzes/:id",protector,generateQuizzes)
uploadRoute.post("/api/quizzes/regenerate/:id",protector, regenerateQuizzesAsync)
uploadRoute.get("/api/flashcards/review",protector, getFlashcardsForReview)
uploadRoute.patch("/api/flashcards/:id/review", protector, updateFlashcardReview);
uploadRoute.get("/api/streak", protector, getUserStreak);
uploadRoute.patch("/api/settings/reminder",protector, uploadReminderSettings)
export default uploadRoute;