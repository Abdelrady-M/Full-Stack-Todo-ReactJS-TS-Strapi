import { useState } from "react";
import Button from "../components/ui/Button"
import { useForm, SubmitHandler } from "react-hook-form"
import { REGISTER_FORM } from "../data";
import Input from "../components/ui/Input";
import InputErrorMessage from "../components/ui/InputErrorMessage";
import { yupResolver } from "@hookform/resolvers/yup"
import { registerSchema } from "../validation";
import axiosInstance from "../config/axios.config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { IErrorResponse } from "../interfaces";




interface  IFormInput{
  username:string;
  email:string;
  password:string;
}


const RegisterPage = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, formState:{errors} } = useForm<IFormInput>({resolver:yupResolver(registerSchema)})
  const [isLoading, setIsLoading] = useState(false);
// Handlers
  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    console.log("DATA", data);
    setIsLoading(true);
    try {
      const {status} = await axiosInstance.post('/auth/local/register', data);
      
      if(status === 200){
        toast.success(
          "You will navigate to the login page after 2 seconds to login.",
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
        setTimeout(() => {
          navigate("/login");
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
const renderRegisterForm = REGISTER_FORM.map(({ name, placeholder, type, validation }, idx) =>{
  return (
    <div key={idx}>
      <Input 
      type={type}
      placeholder={placeholder}
      {...register (name, validation)}
      />
      {errors[name] && <InputErrorMessage msg={errors[name]?.message}/>}
    </div>
  )

})

  return (
    <div className="max-w-md mx-auto">
    <h2 className="text-center mb-4 text-3xl font-semibold">
      Register to get access!
    </h2>
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      {renderRegisterForm}
      <Button fullWidth isLoading={isLoading}>
        {isLoading ? "Loading... " : "Register"}
      </Button>
    </form>
  </div>
  )
}

export default RegisterPage