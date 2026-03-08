import {Document,Schema,model,Types} from "mongoose"
interface IMaterial extends Document {
  title: string;
  originalText: string;
  summary: string;
  userId: Types.ObjectId;
  timestamps: Date;
}
const MaterialSchema = new Schema<IMaterial>({
  title: { type: String, required: true },
  originalText: { type: String, required: true },
  summary: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamps: { type: Date, default: Date.now }
});
const Material = model<IMaterial>('Material', MaterialSchema);
export default Material;