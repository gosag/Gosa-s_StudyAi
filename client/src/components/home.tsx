import { Card, CardContent, CardFooter, CardHeader} from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea";
import {Input} from "./ui/input"
import { FileUp, Send, Loader2,FileText,BrainCircuit } from "lucide-react";
import { StudyStack } from "./illustrations/StudyStack";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
function Home() {
  const [file,setFile]=useState<File | null>(null)
  const [link,setLink]=useState("")
  const [loading,setLoading]=useState(false)
  const summary = localStorage.getItem("summary");
  const [aiData, setAiData] = useState<string | null>(summary ? JSON.parse(summary) as string : null);
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
        setAiData(data.response);
        localStorage.setItem('summary',JSON.stringify(data.response))
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
        setAiData(data.response);
        localStorage.setItem('summary',JSON.stringify(data.response))
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
    if(file && link){
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
    return (
      <div className="ml-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <Card className="mx-1 mr-2 h-screen md:w-full flex flex-col justify-between gap-0 ">
        <CardHeader className="m-0">
          <Button onClick={()=>{setAiData(null)}} className="w-8 h-8 bg-gray-200 text-black p-0 rounded-full cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center z-10">
            <BrainCircuit className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto max-h-full pb-4">
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
        <CardFooter className="relative items-end pb-0 shrink-0">
          <Button className="w-8 h-8 bg-gray-200 text-black absolute bottom-1.75 left-3 p-0 rounded-full cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200 z-10 shrink-0 flex items-center justify-center">
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
            className="pl-12 py-3 min-h-11 max-h-40 resize-none overflow-x-auto rounded-2xl"
          />
          <Button onClick={handleUpload} disabled={loading} className={`text-black  relative ml-2 h-11 w-11 p-0 rounded-full cursor-pointer active:scale-100 hover:scale-105 transition-all duration-200 shrink-0 flex items-center justify-center ${file || link?"bg-green-400 hover:bg-green-500":"bg-gray-200 hover:bg-gray-300"}`}>
            {loading ? <Loader2 className="w-5 h-5 ml-0.5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
            {file?<FileText size={20} className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5" />:null}
          </Button>
        </CardFooter>
      </Card>
      <div className=" h-screen flex items-center justify-center">
        <StudyStack />
      </div>
      </div>
    )}
export default Home;