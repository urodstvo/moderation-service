import { CompanyCard } from './components/CompanyCard';
import { StudentCard } from './components/StudentCard';

export default function PricingPage() {
    return (
        <main className='px-[--container-padding-xl] flex py-5'>
            <div className='mt-[110px] flex justify-center gap-24 w-full'>
                <StudentCard />
                <CompanyCard />
            </div>
        </main>
    );
}
