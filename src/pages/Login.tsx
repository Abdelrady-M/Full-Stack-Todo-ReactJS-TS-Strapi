import Input from "../components/ui/Input"
import InputErrorMessage from "../components/ui/InputErrorMessage"
import { LOGIN_FORM } from "../data"
import { useForm, SubmitHandler } from "react-hook-form"
import { useState } from "react"
import { loginSchema } from "../validation"
import { yupResolver } from "@hookform/resolvers/yup"
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import axiosInstance from "../config/axios.config"
import { IErrorResponse } from "../interfaces"
import Button from "../components/ui/Button"


interface  IFormInput{
  identifier:string;
  password:string;
}



const LoginPage = () => {
  const { register, handleSubmit, formState:{errors} } = useForm<IFormInput>({resolver:yupResolver(loginSchema)})
  const [isLoading, setIsLoading] = useState(false);

// Handlers
const onSubmit: SubmitHandler<IFormInput> = async(data) => {
  console.log("DATA", data);
  setIsLoading(true);
  try {
    const {status, data: resData} = await axiosInstance.post('/auth/local', data);
    
    if(status === 200){
      console.log(data);
      console.log(resData);
      toast.success(
        "ou will navigate to the home page after 2 seconds.",
        {
          position: "bottom-center",
          duration: 1500,
          style: {
            backgroundColor: "black",
            color: "white",
            width: "fit-content",
          },
        }
      );
      localStorage.setItem("loggedInUser", JSON.stringify(resData));
      setTimeout(() => {
       location.replace('/')
      }, 2000);
    }
    
  } catch (error) {
    console.log(error)
    const errorObj = error as AxiosError<IErrorResponse>
    toast.error(`${errorObj.response?.data.error.message}`, {
      position: "bottom-center",
      duration: 4000,
    });
  } finally {
    setIsLoading(false);
  }
}

   // Renders
const renderLoginForm = LOGIN_FORM.map(({name, placeholder, type, validation}, idx)=>{
  return(
    <div key={idx}>
      <Input
      placeholder={placeholder}
      type={type}
      {...register (name, validation)}
      />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message}/>} 
    </div>
  )
})
  return (
    <div className="max-w-md mx-auto">
    <h2 className="text-center mb-4 text-3xl font-semibold">
      Login to get access!
    </h2>
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {renderLoginForm}

      <Button fullWidth isLoading={isLoading}>
        Login
      </Button>
    </form>
  </div>
  )
}

export default LoginPage