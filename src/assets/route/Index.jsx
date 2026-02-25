import { createHashRouter } from "react-router-dom";
import App from '../../App'
import Home from '../pages/Home'
import Login from "./Login";

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
            }
        ]
    }
]

const router = createHashRouter(routes);

export default router;