import { BrowserRouter, Route, Routes } from "react-router-dom"
import { routes } from "@/pages"
import Navbar from "./components/Navbar"

function App() {

  return (
    <>
    <Navbar />
    <main className="main-container">
        <div className="main-content">
            <Routes>
                {routes.map((route, ind) => <Route key={ind} path={route.path} element={route.element}/>)}
            </Routes>
        </div>
    </main>
    </>
  )
}

export default App
