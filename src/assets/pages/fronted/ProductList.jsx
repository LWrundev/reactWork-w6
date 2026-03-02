import { useState , useEffect ,useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function(){
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;
    const [ productList , setProductList ] = useState([]);

    useEffect(()=>{
        const getProductList = (async()=> {
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/products/all`)
                setProductList(res.data.products);
                // console.log(limitData);
                
            } catch (error) {
                console.log(error);
                
            }
        })()
    },[])

    const [ cartData , setCartData ] = useState({ carts: [] });
    const getCartData = useCallback(
        async()=>{
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/cart`)
                console.log('cart',res.data.data);
                setCartData(res.data.data);
            } catch (error) {
                
            }
        }
        ,[]) 

    useEffect(()=>{
        getCartData();
    },[])


    const [ isAddingCheck, setIsAddCheck ] = useState(false);
    const postNewCart = async(productId)=>{
        if(isAddingCheck) return;
        const param = {
            "data" :{
                "product_id": productId,
                "qty": 1
            }
        }
        setIsAddCheck(true);
        
        try {
            const res = await axios.post(`${apiUrl}${apiSub}${apiPath}/cart`,param)
            console.log(res.data);
            if (res.data.success) {
                alert(res.data.message); 
                getCartData(); // 2. 成功後刷新購物車列表
            }
            

        } catch (error) {
            alert(error.response?.data?.message);
        } finally {
            setIsAddCheck(false);     // 無論成功或失敗都結束 Loading
        }
    }
    useEffect(()=>{
        // getCartData();
    },[])

    return <>
        <section className="py-3">
            <div className="row">
                <div className="col">
                    <div className="row row-cols-4 mb-4">
                        {
                            productList.map((item)=>{
                                return (
                                    <div className="col" key={item.id}>
                                        <div 
                                            className="card border-0 rounded-3 bg-light" >
                                            <Link to={`/productlist/${item.id}`}
                                                className="text-decoration-none">
                                                <img src={item.imageUrl} 
                                                    alt={item.title} 
                                                    className="rounded-top-3 w-100 object-fit-cover"
                                                    style={{height:'200px'}} />
                                                <div className="card-body">
                                                    <p className="card-title h5 fw-bold text-dark ">
                                                        {item.title}
                                                    </p>
                                                    <p className="text-danger text-end m-0">${item.price}</p>
                                                </div>
                                            </Link>
                                            <div className="p-2">
                                                <button type="button"
                                                    className="btn btn-primary w-100 fw-bold"
                                                    onClick={()=>postNewCart(item.id)}>
                                                    加入購物車
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        
                    </div>
                </div>
                <div className="col-2">
                        <div>
                            <h2 className="bg-info rounded-3 h5 fw-bold text-light text-center py-2">購物車</h2>
                            <div className="d-flex flex-column gap-1 mb-2">
                            {
                                cartData.carts.length === 0 && (
                                    <div className="card border-info">
                                        <div className="card-body">
                                            <h5 className="h6 text-info text-center m-0">購物車尚無商品</h5>
                                        </div>
                                    </div>
                                )
                            }
                            {
                                cartData.carts.map((item)=>{
                                    return (
                                            <div className="card border-info" key={item.id}>
                                                <div className="card-body">
                                                    <h5 className="text-info fw-bold">{item.product.title}</h5>
                                                    <span>$ {item.product.price}</span>

                                                </div>
                                            </div>
                                    )
                                })
                                
                            }
                            </div>
                            <div className="bg-info rounded-3 py-2">
                                <Link to="/cart" className="d-block h5 fw-bold text-light text-center text-decoration-none m-0">
                                查看更多
                                </Link>
                            </div>
                        </div>
                </div>
            </div>
        </section>
    </>
}