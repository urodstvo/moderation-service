import { Route, Routes, useSearchParams } from 'react-router-dom'
import { routes } from '@/pages/index.tsx'
import Navbar from '@/components/Navbar.tsx'
import Modal from './components/Modal';
import SignInForm from './components/SignInForm';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { fetchDataFromStorage } from './store/auth';

const App = () => {
    const [searchParams, SetSearchParams] = useSearchParams();
    const dispatch = useAppDispatch()
    const { isAuth } = useAppSelector(state => state.auth)

    useEffect(() => {
        dispatch(fetchDataFromStorage());
    }, [])

    const signInModal = () => {
        if (!!searchParams.get('modal'))
            if (!isAuth)
                return (<Modal><SignInForm /></Modal>)
            else SetSearchParams(prev => prev.toString().replace("modal=signIn", ''));
    }

    return (
    <>
    {signInModal()}
    <Navbar />
    <main className="main-container">
        <div className="main-content">
            <Routes>
                {routes.map((route, ind) => <Route key={ind} path={route.path} element={route.element}/>)}
            </Routes>
        </div>
    </main>
    </>
    );
};

export default App;