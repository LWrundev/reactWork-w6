import { useForm } from "react-hook-form";
import axios from "axios";
import InputText from "../../comps/InputText";
import { useCallback, useEffect,useState } from "react";
import { ThreeDots } from "react-loader-spinner";
function Cart(params) {
    const [loading, setLoading] = useState(true);
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

    const [ cartData , setCartData ] = useState({ carts: [] });
    const getCartData = useCallback(
        async()=>{
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/cart`)
                console.log('cart',res.data.data);
                setCartData(res.data.data);
            } catch (error) {
                
            }finally{
                setLoading(false);
            }
        }
        ,[]) 

    useEffect(()=>{
        getCartData();
    },[])


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
                getCartData();
            }
        } catch (error) {
           alert(error.response?.data?.message) 
        }  
    };

    return <>
        <h1>購物車頁面</h1>
        {
            cartData.carts.length === 0 ? (
                <p>購物車內尚無物品</p>
            ) : (
                <p>目前有 {cartData.carts.length} 個品項</p>
            )
        }        
        
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">商品</th>
                    <th scope="col">規格</th>
                    <th scope="col">單價</th>
                    <th scope="col">數量</th>
                    <th scope="col">總價</th>
                    <th scope="col">刪除</th>
                </tr>
            </thead>
            <tbody>
                {
                    loading ? (
                    <tr className="">
                        <td colSpan="7">
                            <ThreeDots
                            height="80"
                            width="80"
                            radius="9"
                            color="var(--bs-info)"
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{ justifyContent: 'center' }}
                            wrapperClass="custom-loader"
                            visible={loading}
                            />
                        </td>
                    </tr>
                    ) : (
                        cartData.carts.map((item)=>{
                            return (
                                <tr key={item.id}>
                                    <td className="d-flex align-items-center">
                                        <div className="me-4"
                                            style={{height:'80px',width:'80px'}}>
                                            <img src={item.product.imageUrl} 
                                            alt={item.product.title}
                                            className="rounded-3 w-100 object-fit-cover"
                                            
                                            />
                                        </div>
                                        {item.product.title}
                                    </td>
                                    <td>
                                        {item.product.content}
                                    </td>
                                    <td>
                                        ${item.product.price}
                                    </td>
                                    <td>
                                        {item.qty}
                                    </td>
                                    <td>
                                        {item.total}
                                    </td>
                                    <td>
                                        <button type="button" className="btn btn-danger">刪除</button>
                                    </td>
                                </tr>
                            )
                        })
                    )
                }
            </tbody>
        </table>
        
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