import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Link } from "react-router-dom";
function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    // Initialize theme from localStorage or system preference
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme === "dark" || savedTheme === "light") return savedTheme;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    }
    return "light";
  });
 const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [streakReminders, setStreakReminders] = useState(true);
  const [studyTime, setStudyTime] = useState("18:00");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");
  const saveStudyTime = async() => {
    try{
        console.log("Saved study reminder time:", studyTime);
        const reminderHour= Number(studyTime.split(":")[0]);
        const reminderMinute= Number(studyTime.split(":")[1]); 
        const token=localStorage.getItem("token");
        const res= await fetch("http://localhost:8000/api/settings/reminder",{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body:JSON.stringify({ reminderHour, reminderMinute })
        });
        const data= await res.json();
        if (!res.ok) {
            throw new Error("Failed to save study reminder time");
        }
        setUpdateStatus(`${data.message || "Study reminder time updated successfully."}`);
        setTimeout(() => setUpdateStatus(null), 5000);
    }catch(err){
        console.log("Failed to save study reminder time:", err);
        setUpdateStatus("Failed to save study reminder time. Please try again.");
        setTimeout(() => setUpdateStatus(null), 5000);
    }
  };
const streakReminderEnable= async()=>{
    try{
        const token=localStorage.getItem("token");
        const res= await fetch("http://localhost:8000/api/settings/reminder",{
            method:"PATCH",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body:JSON.stringify({ streakReminders })
        });
        const data= await res.json();
        if (!res.ok) {
            throw new Error("Failed to update streak reminder setting");
        }
        setUpdateStatus(`${data.message || "Streak reminder setting updated successfully."}`);
        setTimeout(() => setUpdateStatus(null), 5000);
    }catch(err){
        setUpdateStatus("Failed to update streak reminder setting. Please try again.");
        setTimeout(() => setUpdateStatus(null), 5000);
    }
}
  return (
    <div className="max-w-3xl py-10 px-4 md:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your app appearance and notification preferences.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>
              Customize how EchoLearn looks on your device.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-sm text-muted-foreground">
                Currently using {theme} mode.
              </p>
            </div>
            <Button onClick={toggleTheme} variant="outline">
              Switch to {theme === "light" ? "Dark" : "Light"} Mode
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Notifications & Reminders</CardTitle>
            <CardDescription>
              Control when and how we remind you to study and maintain your learning streak.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Streak Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Receive daily nudges to keep your streak alive.
                </p>
              </div>
              <Button 
                onClick={() => {setStreakReminders(prev=>!prev); streakReminderEnable();}}
                variant={streakReminders ? "default" : "secondary"}
              >
                {streakReminders ? "Enabled" : "Disabled"}
              </Button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 mr-4">
                <p className="font-medium">Daily Study Reminder</p>
                <p className="text-sm text-muted-foreground mb-2">
                  Set a specific time to receive a study reminder.
                </p>
                <Input 
                  type="time" 
                  value={studyTime} 
                  onChange={(e) => setStudyTime(e.target.value)} 
                  className="max-w-37.5"
                />
              </div>
              <Button variant="outline" className="hover:scale-105 active:scale-100" onClick={saveStudyTime}>
                Save Time
              </Button>
            </div>
          </CardContent>
          {updateStatus && <p className="text-sm text-muted-foreground text-center">{updateStatus}</p>}
        </Card>
        <Link to="/signup" className="text-sm text-blue-600 hover:underline block text-center">
          signUP
        </Link>
        <Link to="/login" className="text-sm text-blue-600 hover:underline block text-center">
          Login
          </Link>
      </div>
    </div>
  );
}

export default Settings;