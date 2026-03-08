import { Card, CardContent, CardFooter, CardHeader} from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea";
import {Input} from "./ui/input"
import { MessageSquare, FileUp } from "lucide-react";
import { StudyStack } from "./illustrations/StudyStack";
import { Send ,Loader2, FileText} from "lucide-react"
import { useState } from "react";
import ReactMarkdown from "react-markdown";
/* import { Link } from "react-router-dom"; */
function Home() {
  const [file,setFile]=useState<File | null>(null)
  const [link,setLink]=useState<string>("")
  const [loading,setLoading]=useState<boolean>(false)
  const [aiData,setAiData]=useState<string>("")
  function isYoutubeLink(link: string) {
  try {
    const url = new URL(link)
    return (
      url.hostname === "youtube.com" ||
      url.hostname === "www.youtube.com" ||
      url.hostname === "youtu.be"
    )
  } catch {
    return false
  }
}
const fileHandler=async (file: File)=>{
  setLoading(true)
        const formData = new FormData();
        formData.append("pdf", file)
        
        const token = localStorage.getItem("token"); // Get your token from storage
        
        const res = await fetch("http://localhost:8000/api/uploads/file", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        })
        const data = await res.json();
        setAiData(data.response)
        setFile(null)
        setLoading(false)
}
const linkHandler=async (link: string)=>{
  if(!isYoutubeLink(link)){
        alert("Please enter a valid YouTube link.")
        return;
      }
      setLoading(true)
      const token = localStorage.getItem("token"); // Get your token from storage
      
      const res = await fetch("http://localhost:8000/api/uploads/link", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ link})
      });
      
      const data = await res.json();
      if (typeof data.response === "string") {
        setAiData(data.response)
      } 
      else {
        console.error("No transcript found in response", data);
      }
      setLink("");
      setLoading(false);
}

  const handleUpload = async () => {
    if (!file && !link) {
      return
    }
    try {
    if(file && link){6
      alert("Please either upload a file or enter a link, not both.")
      return;
    }
      if (file) {
        await fileHandler(file)
      }
     else if (link) {
      await linkHandler(link)
    }
    } catch (error) {
      console.error("Upload failed:", error)
      setLoading(false);
    }
  }
  function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if(e.key==="Enter" && (file || link)){
      handleUpload()
    }
  }
  async function getAiData(){
    const res = await fetch("http://localhost:8000/api/uploads/test")
    const data = await res.json()
    setAiData(data.response)
  }
    return (
      <div className="ml-1 flex">
        <Card className="ml-1 w-[50%] h-screen flex flex-col justify-between gap-0">
        <CardHeader className="m-0">
          <Button className="w-8 h-8 bg-gray-200 text-black p-0 rounded-full cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center z-10">
            <MessageSquare className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto max-h-full">
          {aiData?(
            <div className="prose prose-sm md:prose-base max-w-none w-full wrap-break-word">
              <ReactMarkdown>{aiData}</ReactMarkdown>
            </div>
          ): (
            <div>
              Bring any topic! I can help you with a wide range of topics, including:
              <ul className="list-disc list-inside mt-2 text-sm text-gray-600">
                <li>Providing explanations and summaries</li>
                <li>Generating quizzes from your notes</li>
                <li>Adaptive flashcard review system</li>
                <li>And much more!</li>
              </ul>
            </div>
          )}
        </CardContent>
        <CardFooter className="relative items-end pb-2 shrink-0">
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
            value={link}
            onKeyDown={handleEnter}
            onChange={(e)=>{setLink(e.target.value)}}
            className="pl-12 py-3 min-h-11 max-h-40 resize-none overflow-y-auto rounded-2xl"
          />
          <Button onClick={handleUpload} disabled={loading} className={`text-black  relative ml-2 h-11 w-11 p-0 rounded-full cursor-pointer active:scale-100 hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center ${file || link?"bg-green-400 hover:bg-green-500":"bg-gray-200 hover:bg-gray-300"}`}>
            {loading ? <Loader2 className="w-5 h-5 ml-0.5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            {file?<FileText size={20} className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" />:null}
          </Button>
        </CardFooter>
      </Card>
      <div className="w-[50%] h-screen flex items-center justify-center">
        <StudyStack />
        {/* <Link to="/signUp" className=" text-sm text-gray-600 hover:text-gray-800 transition">Don't have an account? Sign Up</Link>
        <Link to="/login" className="text-sm text-gray-600 hover:text-gray-800 transition">Already have an account? Login</Link> */}
        <Button onClick={getAiData}> Get AI Data</Button>
       {/*  {aiData && <p>{aiData}</p>} */}
      </div>
      </div>
    )}
export default Home;