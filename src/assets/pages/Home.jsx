import { useState,useEffect } from "react";
import axios from "axios";
function Home(params) {
    
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;
    const [ productList , setProductList ] = useState([]);

    const getProductList = async()=> {
        try {
            const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/products/all`)
            //  只render 4 筆資料
            const limitData = res.data.products.slice(1,5);
            setProductList(limitData);
            // console.log(limitData);
            
        } catch (error) {
            console.log(error);
            
        }
    }

    useEffect(()=>{
        getProductList();
    },[])

    return <>
        <section className="py-3">
            <div className="row row-cols-4 mb-4">
                {
                    productList.map((item)=>{
                        return (
                            <div className="col" key={item.id}>
                                <div className="card border-0 rounded-3 bg-light" >
                                    <img src={item.imageUrl} 
                                        alt={item.title} 
                                        className="rounded-top-3 w-100 object-fit-cover"
                                        style={{height:'200px'}} />
                                    <div className="card-body">
                                        <p className="card-title h5 ">
                                            {item.title}
                                        </p>
                                        <p className="text-end m-0">${item.price}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                
            </div>
            <div className="d-flex">
                <span className="btn btn-info fw-bold text-light ms-auto">
                    更多商品    
                <i className="bi bi-arrow-right-circle"></i>
                </span>
            </div>
        </section>
    </>
}

export default Home;