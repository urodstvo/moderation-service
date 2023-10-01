import { Route, Routes, useSearchParams } from 'react-router-dom'
import { routes } from '@/pages/index.tsx'
import Navbar from '@/components/Navbar.tsx'
import Modal from './components/Modal';
import SignInForm from './components/SignInForm';
import { useEffect } from 'react';
import { useAppDispatch } from './hooks';
import { fetchDataFromStorage } from './store/auth';

const App = () => {
    const [searchParams, SetSearchParams] = useSearchParams();
    const modal = searchParams.get('modal');
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchDataFromStorage());
    }, [])

    return (
    <>
    {modal && (
        <Modal>
            {modal === "signIn" && (
                <SignInForm />
            )}
        </Modal>
    )}
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