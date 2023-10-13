import { useEffect, useLayoutEffect, useMemo } from 'react';
import { Route, Routes, useSearchParams } from 'react-router-dom'
import { admin_routes, public_routes } from '@/pages/index.tsx'
import Navbar from '@/components/Navbar.tsx'
import Modal from '@/components/Modal';
import SettingsForm from '@/components/SettingsForm';
import SignInForm from '@/components/SignInForm';
import { useAppDispatch, useAppSelector } from './hooks';
import { authVerify } from './store/auth';
import { RoleEnum, StateStatus } from './interfaces';
import { showAlert } from './components/ui/Alert';

const App = () => {
    const [searchParams, SetSearchParams] = useSearchParams();
    const dispatch = useAppDispatch()
    const auth = useAppSelector(state => state.auth)
    const role = useAppSelector(state => state.auth.user?.role)

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!!token) dispatch(authVerify({token}));
    }, [])

    const openModal = useMemo(() => {
        if (!!searchParams.get('modal'))
            if (searchParams.get('modal') === "signIn")
                return auth.isAuth ? SetSearchParams(prev => prev.toString().replace("modal=signIn", '')) : (<Modal><SignInForm /></Modal>);
            
            else if (auth.isAuth && searchParams.get('modal') === "settings")
                return (<Modal><SettingsForm /></Modal>);

            else if (auth.isAuth && searchParams.get('modal') === "notification")
                return (<Modal><div /></Modal>);
        else return null;
    }, [searchParams, auth]);

    return (
    <>    
    {auth.status === StateStatus.Success && showAlert(`Welcome to our platform, ${auth.user?.username}!`)}
    {openModal}
    <Navbar />
    <main className="main-container">
        <div className="main-content">
            <Routes>
                {public_routes.map((route, ind) => <Route key={ind} path={route.path} element={route.element}/>)}
                {role === RoleEnum.Admin && admin_routes.map((route, ind) => <Route key={ind + public_routes.length} path={route.path} element={route.element}/>)}
            </Routes>
        </div>
    </main>
    </>
    );
};

export default App;