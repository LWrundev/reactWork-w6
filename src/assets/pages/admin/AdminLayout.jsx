import { Outlet, useNavigate } from "react-router-dom";
import { useEffect,useState } from "react";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_BASE;
const apiSub = import.meta.env.VITE_API_SUB ;

export default function AdminLayout(params) {
    const navigate = useNavigate();
    const [isAuth,setIsAuth]= useState(false);
    const checkLogin = async()=>{
        try {
            const res = await axios.post(`${apiUrl}${apiSub}user/check`);

        } catch (error) {
            alert(error.message,'登入時效過期，請重新登入');
            navigate('/login');
        }
    }
    useEffect(()=>{
    // 1. 從 Cookie 取出 Token
        const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];
    // 2. 如果連 Token 都沒有，直接踢走
        if (!token) {
        alert("請先登入");
        navigate("/login");
        return;
        }
    // 3. 全域設定 Axios 的 Authorization Header
        // 這樣後續所有的 Admin API 才會被伺服器核准
        axios.defaults.headers.common["Authorization"] = token;
    // 4. 呼叫 Check API 檢查 Token 有效性
        checkLogin();
        setIsAuth(true);
    },[navigate])
    

    return <>
        <div className="row">
            <div className="col-2">
                <nav>
                    <ul>
                        <li>商品</li>
                        <li>訂單</li>
                        <li>優惠券</li>
                        <li>文章</li>
                    </ul>
                </nav>
            </div>
            <div className="col-10">
                {
                    isAuth && <Outlet />
                }
                
            </div>
        </div>
    </>
}