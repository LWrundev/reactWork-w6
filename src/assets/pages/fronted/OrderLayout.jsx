import { Outlet } from "react-router-dom";

export default function OrderLayout(params) {
    return <>
        <div className="row">
            <div className="col-2">
                <h1>訂單資料</h1>
            </div>
            <div className="col-10">
                <Outlet/>
            </div>
        </div>
    </>
}