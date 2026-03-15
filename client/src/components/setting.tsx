import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

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

  useEffect(() => {
    // Toggles the "dark" class on the <html> tag for Tailwind styling
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const [streakReminders, setStreakReminders] = useState(true);
  const [studyTime, setStudyTime] = useState("18:00");

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <div className="max-w-3xl py-10 px-4 md:px-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your app appearance and notification preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Appearance Section */}
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

        {/* Notifications & Reminders Section */}
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
                onClick={() => setStreakReminders(!streakReminders)}
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
              <Button variant="outline">Save Time</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;