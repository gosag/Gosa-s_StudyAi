import { useParams ,useNavigate} from "react-router-dom";
import { useEffect ,useState} from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ReactMarkdown from "react-markdown";
import {Loader2,Send} from "lucide-react"
function MaterialContinue(){
    const [material,setMaterial]=useState<{role:string,content:string}[]>([])   
    const [link,setLink]=useState("")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()
    const {id}=useParams()
    useEffect(()=>{
    if(!id){
    navigate(`/library`)
    }},[id])
    useEffect(()=>{async function fetchMaterial(){
        try{ 
            const token=localStorage.getItem("token");
            const res=await fetch(`${import.meta.env.VITE_API_URL}/api/materials/${id}`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            })
            const data=await res.json();
            const materialData=[{role:"model",content:data.material.summary}]
            const chatsData=data.chats.map((chat:{message: {role: string; text: string}[]})=>({
                role:chat.message[0].role,
                content:chat.message[0].text
            }))
             materialData.push(...chatsData);
            setMaterial(materialData);
        }catch(error){
            console.log(error)
        }}
        fetchMaterial()
    },[id])
 const handleUpload=async ()=>{
  try{
  setLoading(true);
  setMaterial(prev=>[...prev,{role:"user",content:link}]);
  const token=localStorage.getItem("token");
  const res=await fetch(`${import.meta.env.VITE_API_URL}/api/continue`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`
    },
    body:JSON.stringify({materialId:id,userMessage:link})
  })
  const data=await res.json();
  setMaterial(prev=>[...prev,{role:"model",content:data.response}]);
  localStorage.setItem('summary',JSON.stringify(data.response))
  setLink('');
  setLoading(false)
}
  catch(error){
    console.error("Failed to continue conversation:", error)
  }
}
 function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if(e.key==="Enter" && !e.shiftKey && (link)){
      e.preventDefault();
      handleUpload()
    }
  }
    return(
        <>
        <div className="max-w-7xl mb-0 mx-auto p-3 sm:p-6 flex flex-col gap-4 sm:gap-6 w-full max-h-dvh">
        <Card className="flex flex-col flex-1  gap-1 min-h-[93vh] w-full max-w-6xl mx-auto shadow-sm border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto w-full p-4 pr-0 sm:p-6 space-y-6 bg-zinc-50/30 dark:bg-zinc-950/30 custom-scrollbar">
            {material.map((item, index) => (
              <div key={index} className={`flex w-full ${item.role === 'user' ? 'justify-end' : 'justify-center'}`}>
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
          <CardFooter className="p-1 pt-0 border-t bg-white dark:bg-zinc-950 shrink-0 relative">
            <div className=" flex items-center gap-3 w-full">
              <Textarea
                placeholder="Ask a follow-up question..." 
                value={link}
                onKeyDown={handleEnter}
                onChange={(e) => setLink(e.target.value)}
                className="flex-1 min-h-11 max-h-32 resize-none rounded-2xl py-3 px-4 shadow-sm border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400"
              />
              <Button 
                onClick={handleUpload} 
                disabled={loading || ( !link)} 
                size="icon"
                className={`rounded-full h-11 w-11 shrink-0 transition-colors ${link ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
        </div>
        </>
    )
}
export default MaterialContinue;