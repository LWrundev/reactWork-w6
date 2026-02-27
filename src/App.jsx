import { Outlet } from "react-router-dom";
import Header from "./assets/comps/Header";

function App() {

  return (
    <>
    <Header></Header>
      <section className="container py-5">
        <Outlet></Outlet>
      </section>

    </>
  )
}

export default App
