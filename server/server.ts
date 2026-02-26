import  mongoose from "mongoose";
const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017")
        console.log("Connected to DB")
    }
    catch(error){
        console.log(error)
    }
}
connectDB()