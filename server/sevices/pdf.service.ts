import { text } from 'node:stream/consumers';
import pdf from 'pdf-parse-new';
const extractTextFromFile=async (buffer:Buffer)=>{
    try{
        const data=await pdf(buffer);
        return{
            text:data.text,
            numpages:data.numpages,
            info:data.info,
        }
    }
    catch(error){
         throw new Error("failed to extract text from file")
    }
}
export default extractTextFromFile;