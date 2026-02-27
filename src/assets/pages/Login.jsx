 import { useForm } from "react-hook-form";
 import { useState,useEffect } from "react";
 import { Navigate, useNavigate } from "react-router-dom";
 import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;
 function Login() {
    const {
        register,
        handleSubmit,
        formState:{errors},
    } = useForm({mode:'onTouched',})
    const navigate = useNavigate();
    const onSubmit = async(data) =>{
        console.log('表單',data);
        try {
            const res = await axios.post(`${apiUrl}/v2/admin/signin`,data)
            console.log(res);
            const {expired,token,uid}=res.data;
            document.cookie = `token=${token}; expires=${new Date(expired)};`;
            axios.defaults.headers.common["Authorization"]=token;

            navigate('/admin');
        } catch (error) {
            
        }
    }
    return <>
        <h1 className="text-center">登入</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
                <label htmlFor="username" className="form-label">
                    信箱
                </label>
                <input type="email" id="username"
                placeholder="name@example.com" 
                className={`form-control ${errors.username && 'is-invalid'}`}
                {...register('username',{
                    required:{ value:true , message: '尚未填寫電子信箱' },
                    pattern:{ value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/ , message :'電子信箱格式不符'}
                })} />
                {
                    errors?.username && (
                        <p className="invalid-feedback">{errors?.username?.message}</p>
                    )
                }
            </div>
            <div>
                <label htmlFor="password" className="form-label">密碼</label>
                <input type="password" id="password" 
                placeholder="123456"
                className={`form-control ${errors.password && 'is-invalid'}`}
                {...register('password',{
                    required:{ value:true , message: '尚未填寫密碼' },
                    minLength:{ value:6, message: '最少須六碼' }
                })} />
                {
                    errors?.password && (
                        <p className="invalid-feedback">{errors?.password?.message}</p>
                    )
                }

            </div>
            <button className="btn btn-primary w-100 my-3" type="submit">
              登入
            </button>
        </form>
    </>  
 }

 export default Login;