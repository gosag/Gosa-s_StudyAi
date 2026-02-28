import { useForm } from "react-hook-form";
function Login(){
interface formData{
    email:string,
    password:string,
    confirmPassword:string
}
    const {
     register,
     handleSubmit,
     getValues,
     reset,
     formState:{errors}
    }=useForm<formData>()
    const onSubmit=()=>{
        alert("submitted")
        reset()
    }
    return(
        <>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type="email"
                {...register("email",{required:"email is required"})}
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