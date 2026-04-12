import {Card, CardFooter, CardHeader, CardContent, CardTitle} from "../components/ui/card"
import { Trash2, FileText, PlayCircle, Brain ,LinkIcon } from "lucide-react";
import {Button} from "../components/ui/button"
import { useState,useEffect} from "react"
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown"
function Library(){
type MType="link"| "file"
interface IMaterial {
  _id:string;
  title: string;
  originalText: string;
  summary: string;
  userId: string;
  timestamps: Date;
  materialType:MType
}
const [materials,setMaterials]=useState<IMaterial[]>([])
const [loading,setLoading]=useState(false)
useEffect(()=>{
    const fetchData=async()=>{
        try{
            setLoading(true)
            const token=localStorage.getItem("token")
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/materials`,{
                method:"GET",
                headers:{
                    "Authorization":`Bearer ${token}`
                }
            })
            const data = await res.json();
            if(!res.ok){
                throw new Error(data.error || "Failed to fetch materials")
            }
            setMaterials(data.materials || []);
        } catch(error){
            console.log(error)
        }finally{
            setLoading(false)
        }
    };
    fetchData()
  },[])
  const deleteHandler=async (materialId:string)=>{
   try{
   const filteredMaterials= materials.filter(material=> material._id!==materialId);
    const token = localStorage.getItem("token");
    const res=await fetch(`${import.meta.env.VITE_API_URL}/api/delete/${materialId}`,{
        method:"DELETE",
        headers:{
            "Content-Type":"application/json",
            "Authorization":`Bearer ${token}`
        },
        body:JSON.stringify({materialId})
    });
    const data=await res.json();
    if(!res.ok){
        throw new Error("Failed to delete material")
    }
    console.log(data)
    setMaterials(filteredMaterials)}
    catch(err){
        console.log(err)
    }
  }

    return(
        <>  
            <div className="w-full h-full p-8 max-w-7xl mx-auto">
            {materials.length>0?(
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.map((material)=>(
                <Card key={material._id} className="w-full rounded-2xl shadow-sm  hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-[radial-gradient(circle_at_bottom_left,var(--color-blue-50),var(--color-zinc-100),var(--color-white))] dark:bg-[radial-gradient(ellipse_at_bottom_left,var(--color-zinc-800),var(--color-zinc-900),var(--color-zinc-950))] border border-gray-100 dark:border-zinc-800 flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="flex items-start gap-3 w-[85%]">
                        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg shrink-0">
                            {material.materialType==="link"?<LinkIcon size={20} className="text-blue-600 dark:text-blue-400"/>:
                            <FileText size={20} className="text-blue-600 dark:text-blue-400" />}
                        </div>
                        <CardTitle className="text-base font-semibold leading-tight line-clamp-2 mt-1 truncate break-all">
                            {material.title}
                        </CardTitle>
                    </div>
                    <button onClick={()=>{deleteHandler(material._id)}} className="text-gray-400 dark:text-gray-500 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 shrink-0">
                        <Trash2 size={18} />
                    </button>
                </CardHeader>
                <CardContent className="pt-2 grow">
                    <p className="text-sm text-gray-500 dark:text-zinc-400 line-clamp-2">
                        <ReactMarkdown>{material.summary || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate."}</ReactMarkdown>
                    </p>
                </CardContent>
                <CardFooter className="pt-4 border-t border-gray-50 dark:border-zinc-800/50 flex gap-3 mt-auto">
                    <Link to={`/library/${material._id}`} className="flex-1">
                    <Button variant="outline" className="flex-1 rounded-xl bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 font-medium transition-all duration-200">
                        <PlayCircle className="w-4 h-4 mr-2 text-gray-500 dark:text-zinc-400" />
                        Continue
                    </Button>
                    </Link>
                    <Link to={`/library/${material._id}/flashcards`} className="flex-1">
                        <Button className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all duration-200">
                            <Brain className="w-4 h-4 mr-2" />
                            Quiz
                        </Button>
                    </Link>
                </CardFooter>  
            </Card>))}</div>):(
                <div>
                {loading?(
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="w-full rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm animate-pulse flex flex-col h-full dark:bg-zinc-900">
                        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                            <div className="flex items-start gap-3 w-3/4">
                                <div className="w-9 h-9 bg-gray-200 dark:bg-zinc-800 rounded-lg shrink-0"></div>
                                <div className="h-5 bg-gray-200 dark:bg-zinc-800 rounded w-full mt-1"></div>
                            </div>
                            <div className="w-6 h-6 bg-gray-200 dark:bg-zinc-800 rounded shrink-0"></div>
                        </CardHeader>
                        <CardContent className="pt-4 grow space-y-2">
                            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-full"></div>
                            <div className="h-3 bg-gray-200 dark:bg-zinc-800 rounded w-4/5"></div>
                        </CardContent>
                        <CardFooter className="pt-4 border-t border-gray-50 dark:border-zinc-800/50 flex gap-3 mt-auto">
                            <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl flex-1"></div>
                            <div className="h-10 bg-gray-200 dark:bg-zinc-800 rounded-xl flex-1"></div>
                        </CardFooter>
                    </Card>
                ))}
               </div>
                ):(
                    <div className="flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl bg-[radial-gradient(circle_at_bottom_left,var(--color-blue-50),var(--color-zinc-100),var(--color-white))] dark:bg-[radial-gradient(ellipse_at_bottom_left,var(--color-zinc-800),var(--color-zinc-900),var(--color-zinc-950))] max-w-3xl mx-auto mt-8">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-5">
                            <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-zinc-100 mb-2">Your library is empty</h3>
                        <p className="text-gray-500 dark:text-zinc-400 max-w-md mx-auto mb-8 leading-relaxed">
                            You haven't added any materials yet. Upload a document or add a link to start generating interactive quizzes and flashcards.
                        </p>
                        <Link to="/material">
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-medium shadow-sm transition-all duration-200">
                                Add New Material
                            </Button>
                        </Link>
                    </div>
                )}
                
            </div>)}
            </div>
        </>
    )
}
export default Library
