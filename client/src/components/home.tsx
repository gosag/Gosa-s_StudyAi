import { Card, CardContent, CardFooter, CardHeader} from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea";
import {Input} from "./ui/input"
import { FileUp, Send, Loader2,FileText,BrainCircuit, PlayCircle, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
function Home() {
  type MType="link"| "file"
  interface IMaterial{
  _id:string;
  title: string;
  originalText: string;
  summary: string;
  userId:string;
  timestamps: Date;
  materialType:MType
}
  const [file,setFile]=useState<File | null>(null)
  const [link,setLink]=useState("")
  const [loading,setLoading]=useState(false)
  const [materialId,setMaterialId]=useState<string | null>(null)
  const [aiData, setAiData] = useState<{role: string, content: string}[]>([]);
  const [lastMaterial, setLastMaterial]=useState<IMaterial | null>(null)
  const [error,setError]=useState<string | null>(null)
  const [materailLoading,setMaterialLoading]=useState(false)
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
        formData.append("file", file)
        
        const token = localStorage.getItem("token");
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/file`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`
          },
          body: formData
        })
        const data = await res.json();
        if(!res.ok){
          setError(data.message || data.error || "something went wrong try again");
          setLoading(false);
          return;
        }
        setAiData([{role: "model",content: data.response}]);
        localStorage.setItem('summary',JSON.stringify(data.response))
        localStorage.setItem('materialId',JSON.stringify(data.materialId));
        setFile(null)
        setMaterialId(data.materialId)
        setLoading(false)
        setError(null)
}
const linkHandler=async (link: string)=>{
  if(!isYoutubeLink(link)){
        alert("Please enter a valid YouTube link.")
        return;
      }
      
      setLoading(true)
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/link`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ link})
      });
      const data = await res.json();
      if(!res.ok){
        setError(data.message || data.error || "something went wrong try again");
        setLoading(false);
        return;
      }
      if (typeof data.response === "string") {
        setAiData([{role: "model",content: data.response}]);
        localStorage.setItem('summary',JSON.stringify(data.response))
        setMaterialId(data.materialId);
        localStorage.setItem('materialId', JSON.stringify(data.materialId));
      } 
      else {
        console.error("No transcript found in response", data);
      } 
      setLink("");
      setLoading(false);
      setError("")
}
const continueHandler=async ()=>{
  try{
  setLoading(true);
  setAiData(prev=>[...prev,{role:"user",content:link}]);
  const token=localStorage.getItem("token");
  const res=await fetch(`${import.meta.env.VITE_API_URL}/api/continue`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`
    },
    body:JSON.stringify({materialId,userMessage:link})
  })
  const data=await res.json();
  if(!res.ok){
    setError(data.message || data.error || "Failed to continue conversation. Please try again.");
    setLoading(false);
    return;
  }
  setAiData(prev=>[...prev,{role:"model",content:data.response}]);
  localStorage.setItem('summary',JSON.stringify(data.response))
  setLink('');
  setLoading(false)
}
  catch(error){
    setError("Failed to continue conversation. Please try again.")
    console.error("Failed to continue conversation:", error)
  }
}
  const handleUpload = async () => {
    if (!file && !link) {
      return
    }
    try {
    if(!materialId){
    if(file && link){
      alert("Please either upload a file or enter a link, not both.")
      return;
    }
      if (file) {
        await fileHandler(file)
      }
     else if (link) {
      await linkHandler(link)
    }}
    else{
      continueHandler()
    }
    } catch (error) {
      console.error("Upload failed:", error)
      setLoading(false);
    }
  }
  function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if(e.key==="Enter" && !e.shiftKey && (file || link)){
      e.preventDefault();
      handleUpload()
    }
  }

  function handleRestart(){
    setAiData([]);
    localStorage.removeItem("summary");
    setMaterialId(null);
    localStorage.removeItem("materialId");
  }
useEffect(()=>{async function lastMaterial(){
  try{
    setMaterialLoading(true);
    const token=localStorage.getItem("token");
    const res=await fetch(`${import.meta.env.VITE_API_URL}/api/materials`,{
      headers:{
        "Authorization":`Bearer ${token}`
      }
    })
    const data=await res.json();
    if(!res.ok){
      throw new Error(data.error || "Failed to fetch materials")
    }
    if(data.materials && data.materials.length > 0){
      setLastMaterial(data.materials[0]);
    }
  }catch(error){
    console.log(error);
  } finally{
    setMaterialLoading(false);
  }
}
 lastMaterial()
}, [])
  return (
    <div className="max-w-7xl mx-auto p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 w-full min-h-screen">
      {/* Header Section */}
      <header className="flex flex-col gap-2 border-b pb-4 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Your Study Materials</h1>
            <p className="text-zinc-500 text-sm mt-1">
              Upload a PDF or paste a link to generate AI-powered summaries, flashcards, and quizzes.
            </p>
          </div>
          <Button title="New Chat" variant="outline" disabled={aiData.length === 0} onClick={handleRestart} className="flex gap-2 items-center rounded-lg">
            <BrainCircuit className="w-4 h-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      {aiData.length === 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Upload Section - Modern drag-and-drop style */}
          <Card className="flex flex-col gap-6 p-8 border-dashed border-2 bg-zinc-50/50 dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors shadow-none">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                <FileUp className="w-8 h-8 text-zinc-600 dark:text-zinc-400" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">Upload Document</h3>
                <p className="text-sm text-zinc-500">Drag and drop your PDF here, or click to browse</p>
              </div>
              <div className="relative w-full max-w-xs">
                <Button variant="secondary" className="relative z-10 w-full rounded-lg">Select File</Button>
                <Input 
                  onChange={(e) => {
                    if (e.target.files) {
                      setFile(e.target.files[0])
                    }
                  }} 
                  type="file" 
                  name="pdf" 
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown,text/csv"
                  className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-pointer"
                />
              </div>
              {file && (
                <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 rounded-md text-sm font-medium border border-green-200 dark:border-green-500/20">
                  <FileText className="w-4 h-4" />
                  <span className="truncate max-w-50">{file.name}</span>
                </div>
              )}
            </div>

            <div className="relative flex items-center py-2">
              <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
              <span className="shrink-0 mx-4 text-zinc-400 text-xs font-medium uppercase tracking-wider">OR</span>
              <div className="grow border-t border-zinc-200 dark:border-zinc-800"></div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Paste YouTube Link </label>
              <div className="flex gap-2">
                <Input
                  placeholder="https://youtube.com/..." 
                  value={link}
                  onKeyDown={handleEnter}
                  onChange={(e) => setLink(e.target.value)}
                  className="flex-1 rounded-lg"
                />
              </div>
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={loading || (!file && !link)} 
              className={`w-full rounded-lg h-11 text-base font-medium transition-all ${file || link ? "bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900" : ""}`}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Send className="w-5 h-5 mr-2" /> Start Learning</>
              )}
            </Button>
            {error && <p className="text-sm text-red-600 dark:text-red-400 text-center">{error}</p>}
          </Card>

          {/* Illustration Container */}
          {lastMaterial ? (
          <div className="hidden lg:flex items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl h-full border border-zinc-200 dark:border-zinc-800 border-dashed">
              <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <CardHeader className="p-0 mb-4">
                  <div className="inline-flex items-center rounded-full border border-zinc-200 dark:border-zinc-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-300">
                    Last Material
                  </div>
                </CardHeader>
                <CardContent className="p-0 space-y-3">
                  <h2 className="text-2xl font-semibold leading-tight text-zinc-900 dark:text-zinc-100 line-clamp-2">
                    {lastMaterial.title}
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
                    Jump back in where you left off and keep your learning streak active.
                  </p>
                </CardContent>
                <CardFooter className="p-0 mt-6 grid grid-cols-2 gap-3">
                  <Link to={`/library/${lastMaterial._id}`} className="flex-1">
                  <Button variant="outline" className="rounded-xl h-10 border-zinc-300 dark:border-zinc-700">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                  </Link>
                  <Link to={`library/${lastMaterial._id}/flashcards`}>
                  <Button className="rounded-xl h-10 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    <Brain className="w-4 h-4 mr-2" />
                    Quiz
                  </Button>
                  </Link>
                </CardFooter>
              </Card>
          </div>):(
            <div>
              {materailLoading?(
                <div className="hidden lg:flex items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl h-full border border-zinc-200 dark:border-zinc-800 border-dashed">
                <Card className="w-full max-w-md p-6 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-zinc-200 dark:border-zinc-800 animate-pulse">
                  <CardHeader className="p-0 mb-4">
                    <div className="h-6 w-32 rounded-full bg-zinc-200 dark:bg-zinc-800"></div>
                  </CardHeader>
                  <CardContent className="p-0 space-y-3">
                    <div className="h-7 w-11/12 rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-4 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-4 w-4/5 rounded-md bg-zinc-200 dark:bg-zinc-800"></div>
                  </CardContent>
                  <CardFooter className="p-0 mt-6 grid grid-cols-2 gap-3">
                    <div className="h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
                    <div className="h-10 rounded-xl bg-zinc-200 dark:bg-zinc-800"></div>
                  </CardFooter>
                </Card>
               </div>
              ):(
                <div className="hidden min-h-115 lg:flex flex-col items-center justify-center p-8 bg-zinc-50/50 dark:bg-zinc-900/50 rounded-xl h-full border border-zinc-200 dark:border-zinc-800 border-dashed text-center gap-4">
                  <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-full">
                    <Brain className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">No Recent Materials</h3>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-xs">
                      Upload a PDF or paste a link on the left to start generating your study content.
                    </p>
                  </div>
               </div>)}
            
            </div>
          )}
        </div>
      ) : (
        /* Chat UI when active */
        <Card className="flex flex-col flex-1 min-h-[70vh] max-h-screen w-full max-w-6xl mx-auto shadow-sm border-zinc-200 gap-1 dark:border-zinc-800 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-zinc-50/30 dark:bg-zinc-950/30 custom-scrollbar">
            {aiData.map((item, index) => (
              <div key={index} className={`flex w-full ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`shadow-sm ${
                  item.role === 'user' 
                  ? 'max-w-[85%] lg:max-w-[75%] rounded-2xl rounded-tr-sm px-5 py-3.5 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100' 
                  : 'max-w-[95%] lg:max-w-[85%] rounded-2xl rounded-tl-sm px-5 sm:px-6 py-4 bg-white text-zinc-900 border border-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:border-zinc-800'
                }`}>
                  <div className={`prose prose-sm md:prose-base dark:prose-invert max-w-none wrap-break-word ${item.role === 'user' ? 'prose-p:m-0' : ''}`}>
                    <ReactMarkdown>{item.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="p-4   border-t bg-white dark:bg-zinc-900/50 shrink-0 relative">
            <div className="flex items-center gap-2 w-full">
             
              <Textarea
                placeholder="Ask a follow-up question..." 
                value={link}
                onKeyDown={handleEnter}
                onChange={(e) => setLink(e.target.value)}
                className="flex-1 min-h-11 max-h-32 resize-none rounded-2xl py-3 px-4 shadow-sm border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400"
              />
              <Button 
                onClick={handleUpload} 
                disabled={loading || (!file && !link)} 
                size="icon"
                className={`rounded-full h-11 w-11 shrink-0 transition-colors ${file || link ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </CardFooter> 
          {error && (
            <CardFooter className="p-4 border-t bg-red-50 dark:bg-red-900 shrink-0">
              <div className="flex items-center gap-2 w-full">
                <div className="p-2 bg-red-100 dark:bg-red-800 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1.707-11.707a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 001.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
              </div>
            </CardFooter>
          )}

        </Card>
      )}
    </div>
  )
}
export default Home;