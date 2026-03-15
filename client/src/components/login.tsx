import { useForm } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
const loginSchema=z.object({
    email:z.email(),
    password:z.string().min(6,"at least 6 characters are required")
})
type TloginSchema= z.infer<typeof loginSchema>
function Login(){
    const {
        register,
        handleSubmit,
        formState:{errors},
        reset
    }=useForm<TloginSchema>({resolver:zodResolver(loginSchema)})
    const submitHandler=async(data:TloginSchema)=>{
      try{
        const res=await fetch("http://localhost:8000/api/auth/login",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(data)
        })
        const result=await res.json()
        if(!res.ok){
          throw new Error(result.message||"something went wrong")
        }
        console.log(result.user)
        localStorage.setItem("token", result.token)
        alert(JSON.stringify(result.user, null, 2))
        reset()
      }
        catch(error){
          console.error(error)
        }
    }
    return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-md">
      
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">EchoLearn</h1>
        <p className="text-sm text-gray-500 mt-2">Welcome back to your dashboard</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-900/5 p-8 sm:p-10">
        {/* Form */}
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
            className="flex w-full justify-center rounded-xl bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black transition-all active:scale-[0.98]"
          >
            Sign in
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
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