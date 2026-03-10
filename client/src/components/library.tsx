import {Card, CardFooter, CardHeader, CardContent, CardTitle} from "../components/ui/card"
import {Button} from "../components/ui/button"
import {FileText} from "lucide-react"
import { useState,useEffect} from "react"
function Library(){
type MType="link"| "file"
interface IMaterial {
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
                    "Content-Type":"application/json",
                    "Authorization":`Bearer ${token}`
                }
            })
            const materials = await res.json();
            setMaterials(materials)
            
        } catch(error){
            console.log(error)
        }
    }
    fetchData()

},[])
    return(
        <>
            <Card className="w-60">
                <CardHeader>
                    <CardTitle><FileText size={20} className="inline wrap-break-word"/> Data Structure & Algorithms</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, voluptate.</p>
                </CardContent>
                <CardFooter className="flex justify-between mx-2">
                    <Button className="bg-green-500 shadow-2xl hover:bg-green-600 hover:scale-105 transition-all duration-200">Continue</Button>
                    <Button className="bg-red-500 hover:bg-red-600 hover:scale-105 transition-all duration-200">Delete</Button>
                </CardFooter>
            </Card>
        </>
    )
}
export default Library