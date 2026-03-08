import {Card, CardFooter, CardHeader, CardContent, CardTitle} from "../components/ui/card"
import {Button} from "../components/ui/button"
import {FileText} from "lucide-react"
function Library(){
    return(
        <>
            <Card className="w-60">
                <CardHeader>
                    <CardTitle><FileText size={20} className="inline wrap-break-word"/> Data Sturucture & Al</CardTitle>
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