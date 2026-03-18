import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
function Settings() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
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
   const streakR= localStorage.getItem("streakReminder")
  const [streakReminders, setStreakReminders] = useState(!(streakR==="true") || false);
  const studyT= localStorage.getItem("studyTime")
  const [studyTime, setStudyTime] = useState(studyT?studyT:"18:00");
  const [loading,setLoading]=useState(false)
  const [APIKey,setAPIKey]=useState<string>("null")
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
    localStorage.setItem("theme", theme === "light" ? "dark" : "light");
  };
  const saveStudyTime = async() => {
    try{
       setLoading(true)
        console.log("Saved study reminder time:", studyTime);
        const localHour=Number(studyTime.split(":")[0])
        const localMinute=Number(studyTime.split(":")[1])
        localStorage.setItem("studyTime",studyTime)
        const localDate = new Date();
        localDate.setHours(localHour, localMinute, 0, 0);
        
        const reminderHour = localDate.getUTCHours();
        const reminderMinute = localDate.getUTCMinutes(); 

        const token=localStorage.getItem("token");
        const res= await fetch(`${import.meta.env.VITE_API_URL}/api/settings/reminder`,{
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
    finally{
      setLoading(false)
    }
  };
const streakReminderEnable= async()=>{
    try{
      setLoading(true)
        setStreakReminders(prev=>!prev);
        localStorage.setItem("streakReminder",JSON.stringify(streakReminders))
        const token=localStorage.getItem("token");
        const res= await fetch(`${import.meta.env.VITE_API_URL}/api/settings/reminder`,{
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
    finally{
      setLoading(false)
    }
}
const [apiLoading,setAPILoading]=useState(false)
const connectAPIKey=async ()=>{
  try{
    setAPILoading(true)
    if(APIKey!="null"){
      const token=localStorage.getItem("token");
      const res= await fetch(`${import.meta.env.VITE_API_URL}/api/user/api-key`,{
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          "Authorization": `Bearer ${token}`
      },
      body:JSON.stringify({ apiKey: APIKey })

      });
      const data= await res.json();
      if (!res.ok) {
        throw new Error("Failed to connect API key");
      }
    const serverMeassage=data.message || "API key connected successfully.";
     alert(serverMeassage);
  }}
  catch(err){
    alert("Failed to connect API key. Please try again.");
  }
  finally{
    setAPILoading(false);
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
            <CardTitle>Gemini API</CardTitle>
            <CardDescription>
              Connect your Gemini API key to enable AI-powered features in EchoLearn.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <Input 
            type="password" 
            placeholder=". . . . . . . . . . . . . ." 
            className="max-w-sm w-full" 
            value={APIKey}
            onChange={(e) => setAPIKey(e.target.value)}
            />
            <Button variant="outline" onClick={connectAPIKey} disabled={apiLoading}>
              {apiLoading ? "Connecting..." : "Connect API Key"}
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
                disabled={loading}
                onClick={() => {streakReminderEnable();}}
                variant={streakReminders ? "default" : "secondary"}
              >
                {streakReminders ? "Enable" : "Disable"}
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
              <Button disabled={loading} variant="outline" className="hover:scale-105 active:scale-100" onClick={saveStudyTime}>
                Save Time
              </Button>
            </div>
          </CardContent>
          {updateStatus && <p className="text-sm text-muted-foreground text-center">{updateStatus}</p>}
        </Card>
      </div>
    </div>
  );
}

export default Settings;