import { Outlet } from "react-router-dom";
import Header from "./assets/comps/Header";
function App() {

  return (
    <>
    <Header></Header>
      <section className="container">
        <Outlet></Outlet>
      </section>

    </>
  )
}

export default App
