import { Provider } from './provider';

export default function DashboardLayout({
    users,
    stats,
    children,
}: Readonly<{ users: React.ReactNode; stats: React.ReactNode; children: React.ReactNode }>) {
    return (
        <Provider>
            <main className='flex flex-col px-[--container-padding-lg]'>
                {children}
                {stats}
                {users}
            </main>
        </Provider>
    );
}
