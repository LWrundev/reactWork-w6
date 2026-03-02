import axios from "axios";
import { Modal } from "bootstrap";
import { useEffect,useState,useRef } from "react";
import { useParams } from "react-router-dom"
import { ThreeDots } from "react-loader-spinner";


export default function OrderDetail() {
    const apiUrl = import.meta.env.VITE_API_BASE;
    const apiSub = import.meta.env.VITE_API_SUB ;
    const apiPath = import.meta.env.VITE_API_PATH;
    const [loading, setLoading] = useState(true);
 
    const {id}=useParams();
    const [ orderData , setOrderData ] = useState(null);

    const modaltarget=useRef(null);
    const modalControl=useRef(null);
    const openModal= ()=>{
        modalControl.current.show();
    }
    const closeModal = ()=>{
        modalControl.current.hide();
    }
    useEffect(()=>{
        const getOrder = async() =>{
            try {
                const res = await axios.get(`${apiUrl}${apiSub}${apiPath}/order/${id}`)
                // console.log(res.data.order);
                // console.log('商品',Object.values(res.data.order.products));
                
                setOrderData(res.data.order);
                
            } catch (error) {

            }finally{
                setLoading(false);
            }
        }
        getOrder();

    },[id])
    //modal初始化
    useEffect(()=>{
        if (modaltarget.current) {
             modalControl.current = new Modal(modaltarget.current);
        };

        return ()=>{
            if (modalControl.current) {
                modalControl.current.dispose();
            }
        };
    },[orderData])

    const postPay = async()=>{
        try {
            const res =await axios.post(`${apiUrl}${apiSub}${apiPath}/pay/${orderData.id}`)
            // console.log(res);
            alert(res.data.message)            
        } catch (error) {
            alert(error.data.message)
        }finally{
            closeModal();
        }
    }
    const { address,email,name,tel } =orderData?.user || {};
    return <>
        <h2>商品清單</h2>
        {
            loading && (
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
        {
            !loading && orderData && <>
                <p>
                    訂單建立時間：
                    {
                        new Date(orderData.create_at *1000).toLocaleString()
                    }
                </p>
                <div className="d-flex flex-column gap-2 py-2">
                    {
                        Object.values(orderData.products).map((item)=>{
                            return (
                            <div key={item.id} className="card d-flex p-2">
                                <div className="row">
                                    <div className="col-lg-2">
                                        <div className="" style={{
                                            height:'80px',
                                            width:'80px'
                                        }}>
                                            <img src={item.product.imageUrl} alt={item.title} 
                                                className="h-100 object-fit-cover rounded-1"/>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body p-0">
                                            <h4 className="card-title">{item.product.title}</h4>
                                            <p className="card-text m-0">{item.product.content}</p>
                                            <hr className="my-1" />
                                            <div className="d-flex justify-beteew">
                                                <span className="card-text">
                                                    {item.qty} {item.product.unit}
                                                </span>
                                                <span className="ms-auto fw-bold">${item.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            )
                        })
                    }
                </div>
                <div>
                    <p className="d-flex align-items-center justify-content-end gap-3 m-0">
                        付款狀態：{orderData.is_paid ? (
                            <div className="">
                                <span className="text-sucess">已付款</span>
                            </div>
                        ): (
                            <span className="text-warning">等待付款中</span>
                        )}
                        { !orderData.is_paid && (
                            <button type="button" 
                            className="btn btn-outline-info"
                            onClick={openModal}
                            >付款去</button>
                        ) }
                        
                    </p>
                    <p className="text-secondary text-end">
                        付款時間：
                        {
                            new Date(orderData?.paid_date *1000).toLocaleString()
                        }

                    </p>

                    <p className="text-end text-danger fw-bold">訂單總金額：$ {orderData.total}</p>
                </div>
                <div>
                    <h3>訂購資訊</h3>
                    <ul className="bg-light p-3 rounded-3 list-unstyled">
                        <li>{name}</li>
                        <li>{email}</li>
                        <li>{tel}</li>
                        <li>{address}</li>
                    </ul>
                    <div>
                        <p className="h5">訂單備註</p>
                        <div className="bg-light p-3 rounded-3">
                            <p className="m-0">{orderData.message}</p>
                        </div>
                    </div>
                </div>
            </>
        }

        <div ref={modaltarget} className="modal" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-body">
                        按了就結完帳
                    </div>
                    <div className="modal-footer">
                        <button type="button" 
                        className="btn btn-outline-info"
                        onClick={postPay}
                        >
                            確認結帳
                        </button>
                        <button type="button" 
                        className="btn btn-outline-danger"
                        onClick={closeModal}
                        >
                            取消
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}