import cron from "node-cron"
import User from "../models/user.model";
import nodeMailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})
const sendEmail = async (to:string, subject:string, text:string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    }
    try {
        const info = await transporter.sendMail(mailOptions)
        console.log(`Email sent to ${to}:`, info.response)
    } catch (error) {

        console.error(`Error sending email to ${to}:`, error)
    }
}
cron.schedule("* * * * *", async () => {
 try{
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()
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

   /*  if (lastStudy.getTime() !== today.getTime()) { */
        if(user.streakReminderEnabled){
            console.log(`Send reminder to ${user.email}`)
            await sendEmail(user.email, "Study Reminder ", "Don't forget to study today! and keep your streak alive! 🔥")
        } 
   /*  } */
  }}catch(err){
    console.log("Error in reminder job:", err)
  }
})