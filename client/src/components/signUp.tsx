import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {Link, useNavigate} from "react-router-dom"
import {z} from "zod"
import { Loader2 } from "lucide-react";
import { useState } from "react";
const signUpSchema=z.object({
    email:z.email(),
    password:z.string().min(6,"at least 6 characters are required"),
    confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
    message:"password must match",
    path:["confirmPassword"]
})
type typesignUpSchema=z.infer<typeof signUpSchema>
function SignUp(){
    const navigate = useNavigate();
    const {
     register,
     handleSubmit,
     reset,
     formState:{errors}
    }=useForm<typesignUpSchema>({resolver:zodResolver(signUpSchema)})
    const [loading, setLoading] = useState(false);
    const onSubmit=async (data:typesignUpSchema)=>{

        try{
        setLoading(true);
        const res=await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`,{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify(data)

        })
        const returnedData=await res.json()
        if(!res.ok){
          console.log("Server responded with HTTP ", res.status, returnedData);
          const errMsg = returnedData.message || returnedData.error || (returnedData.errors && returnedData.errors[0]?.message) || "something went wrong sending data to the server";
          throw new Error(errMsg);
        }
        reset()
        alert("account created successfully, you can now log in")
        navigate("/login", { replace: true })
        
      }
    catch(error: any){
      console.error(error);
      alert(error.message || "An error occurred while creating your account. Please try again.")
    }
     finally{
      setLoading(false);
    }}  
     
  return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EchoStudy</h1>
        <p className="text-sm text-gray-500 mt-2">Create your account to get started</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-8 sm:p-10">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
            className="flex w-full justify-center rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Create account"
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
);
}
export default SignUp;