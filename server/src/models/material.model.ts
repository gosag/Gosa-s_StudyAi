import {Document,Schema,model,Types} from "mongoose"
type MType="link"| "file"
interface IMaterial extends Document {
  title: string;
  originalText: string;
  summary: string;
  userId: Types.ObjectId;
  timestamps: Date;
  materialType:MType
}
const MaterialSchema = new Schema<IMaterial>({
  materialType:{type:String,enum:["file","link"] },
  title: { type: String, required: true },
  originalText: { type: String, required: true },
  summary: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamps: { type: Date, default: Date.now }
}); 
const Material = model<IMaterial>('Material', MaterialSchema);
export default Material;