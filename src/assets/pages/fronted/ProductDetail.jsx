import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";
import axios from "axios";

export default function ProductDetail(params) {
    const {id}=useParams();
    const [ product,setProduct ] = useState({});

    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;

    const getSingleProduct = async()=>{
        try {
            const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/product/${id}`)
            console.log(res.data.product);
            setProduct(res.data.product);
        } catch (error) {
            
        }
    }
    useEffect(()=>{
        getSingleProduct();
    },[])
    if (!product.imagesUrl) {
    return <div>載入中...</div>;
    }
    return <>
        <div className="row gy-3">
            <div className="col-lg-6">
                <div className="card ">
                    <img src={product.imageUrl}
                     alt={product.title} 
                     className="img-fluid" />
                    <div className="d-flex">
                        {
                            product.imagesUrl.map((img,index)=>{ return (
                                <img 
                                key={index}
                                src={img} 
                                alt={product.title} 
                                style={{ 
                                    width: '20%', 
                                    height: 'auto', 
                                    objectFit: 'cover' 
                                }} />
                            )})
                        }
                    </div>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="mb-2">
                    <h1>{product.title}</h1>
                    <span className="badge text-bg-info">
                        {product.category}
                    </span>
                </div>
                <div className="border rounded-3 p-3">
                    <h2 className="h4">商品詳請</h2>
                    <p>{product.description}</p>
                    <p>
                        <strong>規格：</strong><br />
                        {product.content}
                    </p>
                </div>
            </div>
        </div>
    </>
}