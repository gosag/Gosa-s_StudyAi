import  mongoose from "mongoose";
const connectDB=async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/echolearn")
        console.log("Database Connected succesfully")
    }
    catch(error){
        console.log("Database connection failed:",error)
    }
}
export default connectDB;