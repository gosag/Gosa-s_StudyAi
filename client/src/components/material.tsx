import { useParams ,useNavigate} from "react-router-dom";
import { useEffect ,useState, useRef} from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import ReactMarkdown from "react-markdown";
import {Loader2,Send, ArrowDown} from "lucide-react"

function MaterialContinue(){
    const [material,setMaterial]=useState<{role:string,content:string}[]>([])   
    const [chat,setChat]=useState("")
    const [loading,setLoading]=useState(false)
    const chatRef = useRef<HTMLDivElement | null>(null);
    const [showButton,setShowButton]=useState(false)
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
  setMaterial(prev=>[...prev,{role:"user",content:chat}]);
  setTimeout(()=>(scrollToBottom()),200)
  const token=localStorage.getItem("token");
  const res=await fetch(`${import.meta.env.VITE_API_URL}/api/continue`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${token}`
    },
    body:JSON.stringify({materialId:id,userMessage:chat})
  })
  const data=await res.json();
  setMaterial(prev=>[...prev,{role:"model",content:data.response}]);
  localStorage.setItem('summary',JSON.stringify(data.response))
  setChat('');
  setTimeout(()=>(scrollToBottom()),200)
  setLoading(false)
}
  catch(error){
    console.error("Failed to continue conversation:", error)
  }
}
 function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) {
    if(e.key==="Enter" && !e.shiftKey && (chat.trim() !== "")){
      e.preventDefault();
      handleUpload()
    }
  }
useEffect(() => {
  const el = chatRef.current;
  if (!el) return;
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = el;
    setShowButton(scrollHeight - scrollTop - clientHeight >= 50);
  };
  handleScroll();
  el.addEventListener("scroll", handleScroll);
  return () => el.removeEventListener("scroll", handleScroll);
}, []);
  const scrollToBottom = () => {
  if (!chatRef.current) return;
  chatRef.current.scrollTo({
    top: chatRef.current.scrollHeight,
    behavior: "smooth",
  });
};
    return(
        <>
        <div className="max-w-7xl mb-0 mx-auto p-3 sm:p-6 flex flex-col  w-full max-h-dvh">
        <Card className="relative flex flex-col flex-1 pb-2  gap-1 min-h-[93vh] w-full max-w-6xl mx-auto shadow-sm border-zinc-200 dark:border-zinc-900 overflow-hidden">
          <CardContent ref={chatRef} className="flex-1 overflow-y-auto w-full p-4 pr-0 sm:p-6 space-y-6 bg-zinc-50/30 dark:bg-zinc-950/30 custom-scrollbar">
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
          <CardFooter className="p-3 mx-2 rounded-3xl pt-0 border-t bg-white dark:bg-zinc-950 shrink-0 relative">
           {chat.length<1 && showButton &&<button onClick={scrollToBottom} title="Go Bottom" className="absolute z-10 bottom-21 left-[49%] rounded-full bg-zinc-500 p-1 hover:scale-105 hover:bg-zinc-400  active:scale-100 cursor-pointer transition duration-200"><ArrowDown /></button>}
            <div className=" flex items-center  gap-3 w-full">
              <Textarea
                placeholder="Ask a follow-up question..." 
                value={chat}
                onKeyDown={handleEnter}
                onChange={(e) => setChat(e.target.value)}
                className="flex-1 min-h-11 max-h-32 resize-none rounded-2xl  px-4 shadow-sm border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400 custom-scrollbar"
              />
              <Button 
                onClick={handleUpload} 
                disabled={loading || ( !chat)} 
                size="icon"
                className={`rounded-full h-11 w-11 shrink-0 transition-colors ${chat ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200" : "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600"}`}
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