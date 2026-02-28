import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod"
const loginSchema=z.object({
    email:z.string().email(),
    password:z.string().min(6,"at least 6 characters are required"),
    confirmPassword:z.string()
}).refine((data)=>data.password===data.confirmPassword,{
    message:"password must match",
    path:["confirmPassword"]
})
type typeloginSchema=z.infer<typeof loginSchema>
function Login(){
    const {
     register,
     handleSubmit,
     getValues,
     reset,
     formState:{errors}
    }=useForm<typeloginSchema>({resolver:zodResolver(loginSchema)})
    const onSubmit=()=>{
        alert("submitted")
        reset()
    }
    return(
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input
                {...register("email")}
                placeholder="example@email.com"
             />
             <br/>
             {errors.email?.message && <p>{errors.email.message}</p>}
             <input type="password"
                {...register("password",{required:"password is required",
                    minLength:{
                        value:6,
                        message:"at least 6 characters are required"
                    }
                })}
                placeholder="Password"
             />
             <br/>
             {errors.password?.message && <p>{errors.password.message}</p>}
             <input type="password"
                {...register("confirmPassword",{required:"confirm the password",
                    validate:(value)=>value===getValues("password") || "password doesn't match"
                })}
                placeholder="Confirm Password"
             />
             {errors.confirmPassword?.message && <p>{errors.confirmPassword.message}</p>}
             <br/>
             <button type="submit">Submit</button>
        </form>
        
        </>
    )
}
export default Login;