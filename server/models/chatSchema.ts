import { Document, Schema , Types, model} from "mongoose";
type Role="user"| "model"
interface chatT extends Document{
    userId:Types.ObjectId,
    materialId:Types.ObjectId
    messages:[
        role:Role,
        text:string,
        timeStamp:Date
    ]
}
const chatSchema=new Schema<chatT>({
    userId:{
        type:Types.ObjectId,
        required:true
    },
    materialId:{
        type:Types.ObjectId,
        required:true
    },
    messages:[
        {
          role:{
            type:String,
            enum:["user","model"],
            required:true
          },
          text:{
            type:String,
            required:true
          },
          timeStamp:{
            type:Date,
            default:Date.now
          }
        }
    ]
})
const Chat=model<chatT>("Chat",chatSchema)