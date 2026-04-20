import {useForm} from "react-hook-form"
import { z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useState} from "react"
import { Link} from "react-router-dom";
import { Loader2 } from "lucide-react";
const PassReset=({email, setCurrentState}:{email:string, setCurrentState: React.Dispatch<React.SetStateAction<"login" | "emailEnter" | "verification" | "newReset">>})=>{
    const resetPassSchema=z.object({
        password:z.string().min(6,"Password should at least contain 6 characters"),
        confirmPassword:z.string()
    }).refine((data)=>data.password===data.confirmPassword,{
    message:"password must match",
    path:["confirmPassword"]
})
const [loading,setLoading]=useState(false)
type typeResetPassSchema=z.infer<typeof resetPassSchema>
    const{
             register,
             handleSubmit,
             formState:{errors}
            }=useForm<typeResetPassSchema>({
              resolver:zodResolver(resetPassSchema),
              shouldUnregister: false
        })
const onSubmit=async (data:typeResetPassSchema)=>{
    if(!email){
        alert("Email is a must.")
        return
    }
    try{
        setLoading(true);
        const res= await fetch(`${import.meta.env.VITE_API_URL}/api/auth/pass-update`,{
            method:"PATCH",
            headers:{
                "Content-Type":"Application/json"
            },
            body:JSON.stringify({email,password:data.password})
        })
        const result = await res.json();
        if(!res.ok){
            console.log("Server responded with HTTP ", res.status, result);
            const errMsg = result.message || result.error || (result.errors && result.errors[0]?.message) || "something went wrong";
            throw new Error(errMsg);
        }
        alert("Password updated successfully. Please login with your new password.");
        setCurrentState("login");
    }catch(err){
        console.log(err)
    }finally{
        setLoading(false)
    }
}
 return(
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EchoStudy</h1>
        <p className="text-sm text-gray-500 mt-2">Enter a new password and confirm it</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-8 sm:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              {...register("confirmPassword")}
              placeholder="••••••••"
              className={`block w-full rounded-xl border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:outline-none sm:text-sm sm:leading-6 transition-all ${
                errors.confirmPassword
                  ? "ring-red-500 focus:ring-red-500"
                  : "ring-gray-300 focus:ring-black"
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-2">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          
          {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all active:scale-[0.98]"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Change Password"
              )}
            </button>
          </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
      
    </div>
    
  </div>
    </>
 )
}
export default PassReset;