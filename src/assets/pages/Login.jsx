 import { useForm } from "react-hook-form";
 import { useState,useEffect } from "react";
 import { Navigate, useNavigate } from "react-router-dom";
    //--redux
 import { useDispatch } from "react-redux";
 import { login } from "../slices/authSlice";
 import { pushMsg } from "../slices/messageSlice";

 import axios from "axios";
 import MessageToast from "../comps/MessageToast";


const apiUrl = import.meta.env.VITE_API_BASE;
const apiPath = import.meta.env.VITE_API_PATH;
 function Login() {
    //表單設定
    const {
        register,
        handleSubmit,
        formState:{errors},
    } = useForm({mode:'onTouched',})

    const navigate = useNavigate();
    const dispatch = useDispatch();
    //表單送出
    const onSubmit = async(data) =>{
        try {
            const res = await axios.post(`${apiUrl}/v2/admin/signin`,data)
            const {expired,token,uid}=res.data;

            //-- 把token 存進cookie
            document.cookie = `token=${token}; expires=${new Date(expired)};`;
            //-- 把token 存進axios-headers
            axios.defaults.headers.common["Authorization"]=token;
            //-- 把參數存進redux
            dispatch(login(token));
            dispatch(pushMsg({
                type: 'success',
                title: '登入成功',
                text: '即將跳轉頁面'
            }))

            setTimeout(() => {
                navigate('/admin');
            }, 2000);
        } catch (error) {
            
            dispatch(pushMsg({
                type: 'danger',
                title: '登入失敗',
                text: error.response?.data?.message || '請檢查帳號密碼'
            }))
        }
    }

    return <>
        <MessageToast/>
        <section className="container py-5">
            <h1 className="text-center">登入</h1>
            <div className="row">
                <div className="col-lg-8 mx-auto">
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
                </div>
            </div>
        </section>
    </>  
 }

 export default Login;