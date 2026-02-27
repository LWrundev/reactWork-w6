import { useState , useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
export default function(){
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;
    const [ productList , setProductList ] = useState([]);

    const getProductList = async()=> {
        try {
            const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/products/all`)
            setProductList(res.data.products);
            // console.log(limitData);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    const getCartData = async()=>{
        try {
            const res= await axios.get(`${apiUrl}${apiSub}${apiPath}/cart`);
            console.log(res.data.data);
            setCart(res.data.data)
            
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getProductList();
        // postNewCart();
    },[])

    const [ cart , setCart ] = useState([]);
    const postNewCart = async(productId)=>{
        const param = {
            "data" :{
                "product_id": productId,
                "qty": 1
            }
        }
        try {
            // const res = await axios.post(`${apiUrl}${apiSub}${apiPath}/cart`,param)
            // getCartData();
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        // getCartData();
    },[])

    return <>
        <section className="py-3">
            <div className="row row-cols-4 mb-4">
                {
                    productList.map((item)=>{
                        return (
                            <div className="col" key={item.id}>
                                <div to={`/productlist/${item.id}`}
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
                                            onClick={postNewCart(item.id)}>
                                            加入購物車
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
        </section>
        {/* <section>
            <h2 className="text-center">購物車列表</h2>
            <div>
                <span>已選購{cart?.carts?.length}項商品</span>
            </div>
            <table className="table">
                <thead>
                    <tr>
                    <th scope="col">#</th>
                    <th scope="col">名稱</th>
                    <th scope="col">數量</th>
                    <th scope="col">金額</th>
                    <th scope="col">刪除</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        cart?.carts?.map((item,index) =>{ return (
                            <tr key={item.id}>
                                <td>{index+1}</td>
                                <td>{item.product.title}</td>
                                <td>{item.qty}</td>
                                <td>{item.total}</td>
                                <td>
                                    <button type="button" className="btn btn-outline-danger">
                                        <i className="bi bi-x-lg text-danger"></i>
                                    </button>
                                </td>
                            </tr>
                        )

                        })
                    }
                </tbody>
            </table>
            <div>
                <span className="">總金額：{cart.final_total}</span>
            </div>
        </section> */}
    </>
}