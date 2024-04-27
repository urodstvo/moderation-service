import { CompanyCardButton } from './CompanyCardButton';
import { CompanyCardTerms } from './CompanyCardTerms';

export const CompanyCard = () => {
    return (
        <article className='rounded-lg border border-t-4 p-10 border-yellow-500 w-[350px] h-[600px] flex flex-col items-center gap-[60px]'>
            <div className='flex flex-col'>
                <h1 className='text-center font-overpass font-bold text-4xl text-yellow-600'>COMPANY</h1>
                <p className='text-center font-roboto text-2xl'>FREE</p>
            </div>

            <div className='w-full flex-1'>
                <ul className='font-roboto text-lg'>
                    <li className='flex gap-2'>
                        <span>—</span>1000 requests per day
                    </li>
                    <li className='flex gap-2'>
                        <span>—</span>Access to Moderation Service
                    </li>
                </ul>
            </div>

            <div className='w-full h-[84px]'>
                <h3 className='font-roboto text-lg font-bold w-full'>Terms</h3>
                <CompanyCardTerms />
            </div>
            <CompanyCardButton />
        </article>
    );
};
