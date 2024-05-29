import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

import { Demo } from './components/Demo';
import { Integration } from './components/Integration';
import { SideBar } from './components/SideBar';

const Overview = () => {
    return (
        <section className='flex flex-col gap-5' id='overview'>
            <h1 className='font-overpass text-4xl font-bold'>MODERATION SERVICE</h1>
        </section>
    );
};

const Features = () => {
    return (
        <section className='flex flex-col gap-5' id='features'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>Features</h3>
            <div className='w-full flex flex-col gap-10 '>
                <div className='flex justify-between'>
                    <div className='w-[300px] font-overpass text-2xl px-2 border-l-2 border-[#aaa] font-medium'>
                        Different Languages
                    </div>
                    <p className='flex-1 font-roboto text-xl'>
                        Regardless of the language of discussion or publication, our system is able to effectively
                        analyse content and ensure a high level of moderation
                    </p>
                </div>
                <div className='flex justify-between'>
                    <div className='w-[300px] font-overpass text-2xl px-2 border-l-2 border-[#aaa] font-medium'>
                        Variety of formats
                    </div>
                    <p className='flex-1 font-roboto text-xl'>
                        Whether it&apos;s text messages, images, videos or audio recordings, our platform provides
                        comprehensive moderation, ensuring a safe and enjoyable online experience for all users.
                    </p>
                </div>
            </div>
        </section>
    );
};

const Documentation = () => {
    return (
        <section className='flex flex-col gap-5' id='docs'>
            <h3 className='font-overpass text-2xl font-bold text-[#555]'>Documentation</h3>
            <div className='w-full flex flex-col '>
                <div className='border flex flex-col justify-between p-5 items-end gap-2'>
                    <div className='w-full font-overpass text-2xl font-medium'>Endpoints</div>
                    <p className='font-roboto text-xl text-[#333]'>
                        Lorem ipsum dolor sit amet consectetur. Eget dignissim pellentesque quis egestas ac. Consequat
                        odio pharetra lorem suspendisse dolor nulla nulla neque sodales.
                    </p>
                    <Button asChild className='px-5 py-1 font-roboto text-2xl' size={null} variant='ghost'>
                        <Link href='/docs/moderation/overview'>Learn More</Link>
                    </Button>
                </div>
                <div className='border flex flex-col justify-between p-5 items-end gap-2'>
                    <div className='w-full font-overpass text-2xl font-medium'>Integration Examples</div>
                    <p className='font-roboto text-xl text-[#333]'>
                        Lorem ipsum dolor sit amet consectetur. Eget dignissim pellentesque quis egestas ac. Consequat
                        odio pharetra lorem suspendisse dolor nulla nulla neque sodales.
                    </p>
                    <Button asChild className='px-5 py-1 font-roboto text-2xl' size={null} variant='ghost'>
                        <Link href='/docs/moderation/examples'>Learn More</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default function ModerationPage() {
    return (
        <main className='px-[--container-padding-xl] flex justify-between gap-24 py-5'>
            <div className='flex-grow flex flex-col gap-[30px]'>
                <Overview />
                <Button asChild className='w-[300px] py-5 px-10 font-roboto text-xl' size={null}>
                    <Link href='#demo'>TRY DEMO</Link>
                </Button>
                <Features />
                <Demo />
                <Documentation />
                <Integration />
            </div>
            <SideBar />
        </main>
    );
}
