import { useForm } from "react-hook-form";
import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
const loginSchema=z.object({
    email:z.email(),
    password:z.string().min(6,"at least 6 characters are required")
})

type TloginSchema= z.infer<typeof loginSchema>
function Login(){
  const [loading, setLoading] = useState(false);
  const [CurrentState,setCurrentState]=useState<"login" | "emailEnter" | "verification">("login")
    const {
        register,
        handleSubmit,
        formState:{errors},
        reset
    }=useForm<TloginSchema>({resolver:zodResolver(loginSchema)});
  const [expectedCode,setExpectedCode]=useState("");
  const [verificationCode,setVerificationCode]=useState("");
  const [email,setEmail]=useState("")
    const submitHandler=async(data:TloginSchema)=>{
      try{
        setLoading(true);
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(data)
        })
        const result=await res.json()
        if(!res.ok){
          console.log("Server responded with HTTP ", res.status, result);
          const errMsg = result.message || result.error || (result.errors && result.errors[0]?.message) || "something went wrong";
          throw new Error(errMsg);
        }
        localStorage.setItem("token", result.token)
        reset();
        window.location.href = "/";
        
      }
        catch(error: any){
          console.error(error)
          alert(error.message || "An error occurred while logging in. Please try again.")
        }
        finally{
          setLoading(false);
        }
    }
    const resetHandler=()=>{
      if(!email && !email.includes("@gmail.com")){
        alert("Please enter valid and your email first.")
        return;
      }
      if(CurrentState==="emailEnter"){
        const getCode=async()=>{
          try{
          const res= await  fetch(`${import.meta.env.VITE_API_URL}`,{
            method:"POST",
            headers:{"Content-Type":"Application/json"},
            body:JSON.stringify({email})
          })
          const data= await res.json()
          if(!res.ok){
            console.log("Server responded with HTTP ", res.status, data);
             const errMsg = data.message || data.error || (data.errors && data.errors[0]?.message) || "something went wrong";
            throw new Error(errMsg);
           }
           setExpectedCode(data.code);
           setCurrentState("verification")
          }catch(err){
            console.log(err)
          }}
          getCode()
        }
      if(CurrentState==="verification"){
        if(verificationCode===expectedCode.toString()){
          alert("Verification successful! You can now reset your password.")
          setCurrentState("login")
        }
        else{
          alert("Invalid verification code. Please check your email and try again.")
        }
      }}
    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EchoStudy</h1>
        <p className="text-sm text-gray-500 mt-2">Welcome back to your dashboard</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-8 sm:p-10">
        {/* Form */}
        {CurrentState==="login"?(
        <form onSubmit={handleSubmit(submitHandler)} className="space-y-6">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Email address
            </label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className={`block w-full rounded-xl border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6 transition-all ${
                errors.email
                  ? "ring-red-500 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-black"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              className={`block w-full rounded-xl border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6 transition-all ${
                errors.password
                  ? "ring-red-500 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-black"
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-black transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Sign in"
            )}
          </button>
        </form>):(
          <div>
          <form className="w-full flex justify-center items-center flex-col">
            {CurrentState==="verification"?<p className="font-medium mb-4">We have sent an email to {email}</p>:
              <p className="font-medium mb-4">Please! Enter your email.</p>
            }
            <div>
              <label className="mr-2 font-semibold ">Email:</label>
              <input className="ring-2 ring-gray-400 w-62.5 h-8 rounded-md text-center mb-4" placeholder="example@gmail.com" onChange={(e)=>{setEmail(e.target.value)}} />
            </div>
            {CurrentState==="verification" && (
              <div>
                <label className="mr-2 font-semibold ">Code:</label>
                <input onChange={(e)=>{setVerificationCode(e.target.value)}} className="ring-2 ring-gray-400 w-62.5  h-8 rounded-md text-center " placeholder="EX 3465"/>
              </div>

            )}
            <Button variant="default" className="mt-4 px-6" type="submit" onClick={resetHandler}>{CurrentState==="verification"?"Verify":"Send Code"}</Button>
          </form>
          </div>
        )}

        {/* Footer */}
        {CurrentState==="login" && <button onClick={()=>{setCurrentState("emailEnter")}} className="w-full hover:scale-105 transition-all duration-200">
        <p className="text-center mb-0 mt-4 text-red-500">Forgot password? </p>
        </button>}
        <p className="text-center text-sm text-gray-500 mt-2">
          Don’t have an account?{" "}
          <Link to="/signUp" className="font-semibold text-black hover:underline">
            Sign up
          </Link>
        </p>
      </div>

    </div>
  </div>
);
}
export default Login;