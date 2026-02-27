import { useForm } from "react-hook-form";
import axios from "axios";
import InputText from "../../comps/InputText";

function Cart(params) {
    //API
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;

    const {
        register,
        handleSubmit,
        reset,
        formState:{ errors },
    }=useForm({
        mode: 'onTouched'
    });

    const onSubmitOrder = async(data)=>{
        const {message,...user} = data;     //因為API-data裡分為使用者資訊，與訊息兩類
        const param ={
            data:{
                user,message
            }
        }
        try {
            const res = await axios.post(`${apiUrl}${apiSub}${apiPath}/order`, param)
            if(res.data.success){
                alert("已送出訂單");
                reset();
            }
        } catch (error) {
           alert(error.response?.data?.message) 
        }  
    };

    return <>
        <h1>購物車頁面</h1>

        <hr />

        <h2 className="text-center">填寫訂購人資訊</h2>
        <div className="row">
            <div className="col-md-8 mx-auto">
                <form action="" onSubmit={handleSubmit(onSubmitOrder)}
                    className="d-flex flex-column gap-3">
                    <InputText 
                    id="name" type='text' 
                    labelText='請填寫姓名' 
                    holder='姓名' 
                    register={register} 
                    errors={errors} 
                    rule={{
                        required:{value: true, message: '此項為必填' }
                    }}
                    />
                    <InputText 
                        id="email" type='email' 
                        labelText='請填寫電子信箱' 
                        holder='電子信箱' 
                        register={register} 
                        errors={errors} 
                        rule={{
                            required:{value: true, message: '此項為必填' },
                            pattern: { 
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                                message: 'Email 格式不正確'
                            }
                        }}
                    />
                    <InputText 
                        id="tel" type='tel' 
                        labelText='請填寫電話' 
                        holder='電話' 
                        register={register} 
                        errors={errors} 
                        rule={{
                            required:{value: true, message: '此項為必填' },
                            pattern: { value: /^(09)[0-9]{8}$/, message: '電話格式不正確' }
                        }}
                    />
                    <InputText 
                        id="address" type='text' 
                        labelText='請填寫收貨地址' 
                        holder='收貨地址' 
                        register={register} 
                        errors={errors} 
                        rule={{
                            required:{value: true, message: '此項為必填' }
                        }}
                    />
                    <InputText 
                        id="message" type='text' 
                        labelText='請填寫訂單備註（限100字）' 
                        holder='訂單備註' 
                        register={register} 
                        errors={errors} 
                        rule={{
                            required:{value: true, message: '此項為必填' },
                            maxLength:{ value: 100, message: '訂單備註限100字' }
                        }}
                    />
                    <div>
                        <button type="submit"
                            className="btn btn-outline-primary">
                            送出訂單
                        </button>
                    </div>



                </form>
            </div>
        </div>
    </>
}

export default Cart;