import { Route, Routes } from 'react-router-dom'
import { admin_routes, public_routes } from '@/pages/index.tsx'
import Navbar from '@/components/Navbar.tsx'
import { useAppSelector } from '@/hooks';
import { RoleEnum } from '@/interfaces';
import { useVerifyQuery } from '@/api/authAPI';
import { ToastContainer } from 'react-toastify';
import ModalContainer from './components/ModalContainer';

const App = () => {
    const {user} = useAppSelector(state => state.auth)

    useVerifyQuery()
   

    return (
    <>    
    <ToastContainer />
    <ModalContainer />
    <Navbar />
    <main className="main-container">
        <div className="main-content">
            <Routes>
                {public_routes.map((route, ind) => <Route key={ind} path={route.path} element={route.element}/>)}
                {user?.role === RoleEnum.Admin && admin_routes.map((route, ind) => <Route key={ind + public_routes.length} path={route.path} element={route.element}/>)}
            </Routes>
        </div>
    </main>
    </>
    );
};

export default App;