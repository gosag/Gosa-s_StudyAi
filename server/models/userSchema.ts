import {Schema,Document,Types,model} from "mongoose"
 export interface IUser extends Document {
  email: string;
  password?: string; 
  savedMaterials: Types.ObjectId[];
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  savedMaterials: [{ type: Schema.Types.ObjectId, ref: 'Material' }]
});

const User = model<IUser>('User', UserSchema);
export default User;