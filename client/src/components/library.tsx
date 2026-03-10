import {Card, CardFooter, CardHeader, CardContent, CardTitle} from "../components/ui/card"
import { Trash2 } from "lucide-react";
import {Button} from "../components/ui/button"
import {FileText} from "lucide-react"
import { useState,useEffect} from "react"
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
useEffect(()=>{
    const fetchData=async()=>{
        try{
            const token=localStorage.getItem("token")
            const res = await fetch("http://localhost:8000/api/materials",{
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
        }
    };
    fetchData()
  },[])
    return(
        <>  
            <div>
            {materials.length>0?(
                <div className="flex flex-wrap gap-6 justify-center">
                {materials.map((material)=>(
                <Card key={material._id} className="w-60">
                <CardHeader className="grid grid-cols-2">
                    <CardTitle><FileText size={20} className="inline wrap-break-word"/>{material.title}</CardTitle>
                    <Trash2 size={28} className="ml-auto cursor-pointer text-red-500 hover:text-red-600" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
                </CardContent>
                <CardFooter className="flex justify-between mx-2">
                    <Button className="bg-green-500 shadow-2xl hover:bg-green-600 hover:scale-105 transition-all duration-200">Continue</Button>
                    <Button className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-all duration-200">Quiz</Button>
                </CardFooter>
            </Card>))}</div>):<div>fetching data</div>}
            </div>
        </>
    )
}
export default Library