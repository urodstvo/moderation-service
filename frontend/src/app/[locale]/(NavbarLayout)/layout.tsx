import { Navbar } from './components/Navbar/navbar';

export default function NavBarLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}
