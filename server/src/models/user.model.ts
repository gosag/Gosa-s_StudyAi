import {Schema,Document,model} from "mongoose"
 export interface IUser extends Document {
  email: string,
  password: string,
  currentStreak:number,
  longestStreak:number,
  lastActivityDate:Date,
  streakReminderEnabled: boolean,
  timezone: string,
  reminderHour: number,
  reminderMinute: number,
  apiKey: string | null,
  freeUsageCount: number,
 }
 
const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastActivityDate:{type:Date, default: Date.now},
  streakReminderEnabled: { type: Boolean, default: true },
  reminderHour: { type: Number, default: 20 }, // Default to 8 PM
  reminderMinute: { type: Number, default: 0 }, // Default to 0 minutes
  timezone: { type: String, default: "UTC" },
  apiKey: { type: String, default: null },
  freeUsageCount: { type: Number, default: 0 },

});

const User = model<IUser>('User', UserSchema);
export default User;