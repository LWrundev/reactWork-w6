import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";

export default function OrderList(params) {
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;
    const [loading, setLoading] = useState(true);
    const [ordersData,setOrdersData] = useState([]);
    useEffect(()=>{
        const getOrders = async() =>{
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/orders`)
                console.log(res.data.orders);
                setOrdersData(res.data.orders);
            } catch (error) {
                
            }finally{
                setLoading(false);
            }
        }
        getOrders();
    },[])

    if (loading) {
        return (
            <div className="">
                <ThreeDots
                height="80"
                width="80"
                radius="9"
                color="var(--bs-info)"
                ariaLabel="three-dots-loading"
                wrapperStyle={{ justifyContent: 'center' }}
                wrapperClass="custom-loader"
                visible={true}
                />
            </div>
        )
    }
    return <>

        <p>訂單列表</p>
        <table className="table">
            <thead>
                <tr>
                    <th scope="col">訂單編號</th>
                    <th scope="col">訂單金額</th>
                    <th scope="col">付款狀態</th>
                    <th scope="col">訂單詳情</th>
                </tr>
            </thead>
            <tbody>
                {
                    ordersData.map((item)=>{
                        return (
                            <tr key={item.id}>
                                <td className="d-flex flex-column gap-3">
                                    <span>{item.id}</span>
                                    <span>
                                         下單時間：
                                        {new Date(item.create_at * 1000).toLocaleString()}
                                        </span>
                                </td>
                                <td>
                                    $ {item.total}
                                </td>
                                <td>
                                    {item.is_paid ? <span>已付款</span> :
                                     <span>等待付款中</span> }
                                </td>
                                <td>
                                    <Link to={item.id}>
                                        查看訂單
                                    </Link>
                                </td>
                            </tr>
                        )
                    })
                }                
            </tbody>
        </table>
    </>
}