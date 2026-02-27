import { createHashRouter } from "react-router-dom";
import App from '../../App'
import Home from '../pages/Home'
import Login from "../pages/Login";
import FrontedLayout from "../pages/fronted/FrontedLayout";
import ProductList from "../pages/fronted/ProductList";
import ProductDetail from "../pages/fronted/ProductDetail";
import Cart from "../pages/fronted/Cart";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminProducts from "../pages/admin/AdminProducts";

const routes = [
    {
        path: '/',
        element: <App />,
        children:[
            {
                index: true,
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/ProductList',
                element: <FrontedLayout/>,
                children:[
                    {
                        index: true,
                        element: <ProductList/>
                    },
                    {
                        path: ':id',
                        element: <ProductDetail />
                    },
                ]
            },
            {
                path: 'cart',
                element: <Cart/>
            },

            {
                path: '/admin',
                element: <AdminLayout/>,
                children: [
                    {
                        index: true,
                        element: <AdminProducts/>
                    }
                ]
            },
        ]
    }
]

const router = createHashRouter(routes);

export default router;