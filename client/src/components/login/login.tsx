import { useForm } from "react-hook-form";
import {z} from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
const loginSchema=z.object({
    email:z.string().email(),
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
    const submitHandler=()=>{
        alert("succesfull login");
        reset()
    }
    return (
  <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 px-4">
    
    <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 space-y-6">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800">EchoLearn</h1>
        <p className="text-gray-500 mt-1">Welcome back 👋</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(submitHandler)} className="space-y-5">

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register("email")}
            placeholder="example@gmail.com"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.email
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
              errors.password
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-indigo-500"
            }`}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200 active:scale-95"
        >
          LogiIn
        </button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500">
        Don’t have an account?{" "}
        <span className="text-indigo-600 font-medium cursor-pointer hover:underline">
          <Link to="/">Sign Up</Link>
        </span>
      </p>

    </div>
  </div>
);
}
export default Login;