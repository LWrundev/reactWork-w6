import { Outlet } from "react-router-dom";
import Header from "../../comps/Header";

export default function FrontedLayout() {
    return <>
        <div >
            <Outlet/>
        </div>
    </>
}