import { SideBar } from './components/sidebar';

export default function DocsLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <div className='flex px-[--container-padding-lg] relative items-stretch py-5 gap-10'>
            <SideBar />
            {children}
        </div>
    );
}
