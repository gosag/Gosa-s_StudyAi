import {Schema,Document,Types,model} from "mongoose"
 export interface IUser extends Document {
  email: string;
  password?: string; 
 }
 
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = model<IUser>('User', UserSchema);
export default User;