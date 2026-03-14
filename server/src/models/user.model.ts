import {Schema,Document,Types,model} from "mongoose"
 export interface IUser extends Document {
  email: string;
  password?: string; 
  currentStreak:number,
  longestStreak:number,
  lastActivityDate:Date
 }
 
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentStreak: { type: Number, default: 1 },
  longestStreak: { type: Number, default: 1 },
  lastActivityDate:{type:Date, default: Date.now}
});

const User = model<IUser>('User', UserSchema);
export default User;