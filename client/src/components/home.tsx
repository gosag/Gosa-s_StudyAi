import { Card, CardContent, CardFooter, CardHeader} from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea";
import {Input} from "./ui/input"
import { MessageSquare, FileUp } from "lucide-react";
import { StudyStack } from "./illustrations/StudyStack";
import { Send } from "lucide-react"
import { useState } from "react";
function Home() {
  const [file,setFile]=useState<File | null>(null)
  const [data,setData]=useState<any>(null)
  const [link,setLink]=useState<string>("")
  const handleUpload = async () => {
    if (!file && !link) {
      return
    }
    try {
      if (file) {
        const formData = new FormData();
        formData.append("pdf", file)
        const res = await fetch("http://localhost:8000/api/uploads/file", {
          method: "POST",
          body: formData
        })
        const data = await res.json();
        console.log(data)
        setData(data)
        setFile(null)
      }
     else if (link) {
  const res = await fetch("http://localhost:8000/api/uploads/link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ link })
  });

  const data = await res.json();

  // 1. Check if the backend sent a direct 'text' property
  if (data.text) {
    setData({ text: data.text });
  } 
  // 2. Check if 'transcript' is a STRING (This matches your current backend)
  else if (typeof data.transcript === "string") {
    setData({ text: data.transcript });
  } 
  // 3. Fallback: Check if it's an ARRAY (for older scrapers)
  else if (Array.isArray(data.transcript)) {
    const text = data.transcript.map((item: any) => item.text).join(" ");
    setData({ text });
  } 
  else {
    console.error("No transcript found in response", data);
  }

  setLink("");
}
    } catch (error) {
      console.error("Upload failed:", error)
    }
  }
    return (
      <div className="ml-1 flex">
        <Card className="ml-1 w-97.5 h-screen flex flex-col justify-between">
        <CardHeader>
          <Button className="w-8 h-8 bg-gray-200 text-black p-0 rounded-full cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center z-10">
            <MessageSquare className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent>
          Bring any topic! I can help you with a wide range of topics, including:
          <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
            <li>Providing explanations and summaries</li>
            <li>Generating quizzes from your notes</li>
            <li>Adaptive flashcard review system</li>
            <li>And much more!</li>
          </ul>
        </CardContent>
        <CardFooter className="relative items-end pb-2">
          <Button className="w-8 h-8 bg-gray-200 text-black absolute bottom-3 left-3 p-0 rounded-full cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200 z-10 shrink-0 flex items-center justify-center">
              <FileUp className="w-5 h-5" />
               
          </Button>
          <Input onChange={(e)=>{
            if(e.target.files){
              setFile(e.target.files[0])
            }
          }} type="file" name="pdf" accept="application/pdf"  className="w-8 h-8 opacity-0 z-20 bg-transparent text-black absolute bottom-3 left-3 p-0  cursor-pointer"/>
          <Textarea
            placeholder="Paste link or type text..." 
            onChange={(e)=>{setLink(e.target.value)}}
            className="pl-12 py-3 min-h-11 max-h-40 resize-none overflow-y-auto rounded-2xl"
          />
          <Button onClick={handleUpload} className={`text-black  relative ml-2 h-11 w-11 p-0 rounded-full cursor-pointer active:scale-100 hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center ${file || link?"bg-green-400 hover:bg-green-500":"bg-gray-200 hover:bg-gray-300"}`}>
              <Send className="w-5 h-5 ml-0.5" /> 
          </Button>
        </CardFooter>
      </Card>
      <div className="transition duration-300 hover:-translate-y-2 hover:rotate-01 hover:scale-103">
        <StudyStack />
        <p className="text-center text-sm mt-2">{data?.text}</p>
      </div>
      </div>
    )}
export default Home;