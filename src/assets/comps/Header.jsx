import { NavLink } from "react-router-dom"

export default function Header(params) {
    return <>
        <header className="bg-body-tertiary">
            <nav className="container navbar navbar-expand-lg ">
            <div className="container-fluid">
                <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
                >
                <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                    <NavLink to='/' className="nav-link active" aria-current="page">
                        Home
                    </NavLink>
                    </li>
                    <li className="nav-item">
                    <NavLink to="/productlist" className="nav-link" href="#">
                        商品列表
                    </NavLink>
                    </li>
                </ul>
                <div>
                    <NavLink to='/admin'className="btn btn-info text-light fw-bold w-100" >
                        管理頁面
                    </NavLink>
                </div>
                </div>
            </div>
            </nav>
        </header>
    </>
}