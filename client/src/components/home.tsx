import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea";
function Home() {
    return (
        <Card className="w-87.5 h-80 flex flex-col justify-between">
        <CardHeader>
          <CardTitle>Your AI Study Dashboard</CardTitle>
        </CardHeader>

        <CardContent>
          
        </CardContent>

        <CardFooter className="relative">
          <Button className="w-8 h-8 bg-gray-200 text-black absolute bottom-0.5 left-2 cursor-pointer hover:bg-gray-300 hover:scale-105 transition-all duration-200 ">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >

              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              

              <line x1="12" y1="17" x2="12" y2="11"/>
              <polyline points="9 14 12 11 15 14"/>
            </svg>
          </Button>
          <Textarea placeholder="Paste link or type text..."className="pl-9">
          </Textarea>
          <Button className="bg-gray-200 text-black relative ml-1 cursor-pointer hover:bg-transparent hover:scale-105 transition-all duration-200 ">
              <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </Button>
        </CardFooter>
      </Card>
    )}
export default Home;