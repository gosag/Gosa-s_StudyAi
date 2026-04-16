import cron from "node-cron"
import User from "../models/user.model";
import { Resend } from "resend"
import dotenv from "dotenv"

dotenv.config()

const resend = new Resend(`${process.env.RESEND_API_KEY!}`);
const sendEmail=async(to:string, subject:string, text:string)=>{
      await resend.emails.send({
        from: "EchoStudy <noreply@echostudy.gosagirma.me>",
        to,
        subject,
        text
     });}
cron.schedule("* * * * *", async () => {
 try{
  const now = new Date()
  const hour = now.getUTCHours()     // Use UTC time
  const minute = now.getUTCMinutes()

  const users = await User.find({
    reminderHour: hour,
    reminderMinute: minute,
    streakReminderEnabled: true
  })
  console.log(`Cron running at ${hour}:${minute}`);
  for (const user of users) {
    const lastActivity = new Date(user.lastActivityDate)

    const today = new Date()
    today.setHours(0,0,0,0)

    const lastStudy = new Date(lastActivity)
    lastStudy.setHours(0,0,0,0)

    if (lastStudy.getTime() !== today.getTime()) {
        if(user.streakReminderEnabled){
            console.log(`Send reminder to ${user.email}`)
            await sendEmail(user.email, "Study Reminder ", "Don't forget to study today! and keep your streak alive! 🔥")
        } 
    }
  }}catch(err){
    console.log("Error in reminder job:", err)
  }
})