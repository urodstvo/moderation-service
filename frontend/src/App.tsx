import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useVerifyQuery } from "@/api/authAPI";
import Navbar from "@/components/Navbar.tsx";
import ModalContainer from "@/components/ModalContainer";

const App = () => {
  useVerifyQuery();

  return (
    <>
      <ToastContainer />
      <ModalContainer />
      <Navbar />
      <main className="main-container">
        <div className="main-content">
          <Outlet />
        </div>
      </main>
    </>
  );
};

export default App;
