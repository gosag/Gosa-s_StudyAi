import  mongoose from "mongoose";
const connectDB=async()=>{
    try{
        const MONGO_URI=process.env.MONGO_URI!
        await mongoose.connect(MONGO_URI)
        console.log("Database Connected succesfully")
    }
    catch(error){
        console.log("Database connection failed:",error)
    }
}
export default connectDB;