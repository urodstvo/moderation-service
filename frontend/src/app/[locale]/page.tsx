import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Link } from '@/navigation';

export default function Home() {
    const t = useTranslations('Home');
    return (
        <div className='flex min-h-screen flex-col items-center bg-gradient-to-b from-[#222222] to-[#000000] py-5 gap-24'>
            <header className='w-full px-[--container-padding-lg]'>
                <nav className='flex align-center justify-end gap-10'>
                    <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
                        <Link href='/services/moderation' className='font-overpass text-xl text-white font-medium'>
                            Service
                        </Link>
                    </Button>
                    <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
                        <Link href='/pricing' className='font-overpass text-xl text-white font-medium'>
                            Pricing
                        </Link>
                    </Button>
                    <Button asChild className='rounded-full px-5 py-1' variant='ghost'>
                        <Link href='/docs' className='font-overpass text-xl text-white font-medium'>
                            Documentation
                        </Link>
                    </Button>
                </nav>
            </header>
            <main className='size-full px-[--container-padding-lg] flex flex-col items-center grow gap-24'>
                <div className='w-[840px] flex flex-col items-center gap-10'>
                    <h1 className='scroll-m-20 text-[128px] font-black tracking-tight text-white'>{t('Title')}</h1>
                    <p className='text-2xl font-roboto text-white'>
                        Lorem ipsum dolor sit amet consectetur. Ut senectus ut turpis proin. Neque sit nunc dignissim
                        consequat sollicitudin luctus viverra quis integer. Neque ultrices purus quam adipiscing.
                        Fermentum sem suspendisse arcu tincidunt. Id nisi facilisis eu aenean enim porta.
                    </p>
                </div>
                <Button asChild className='py-5 w-[300px] bg-transparent' size={null} variant='outline'>
                    <Link href='/register' className='font-roboto text-xl font-bold text-white'>
                        GET STARTED
                    </Link>
                </Button>
            </main>
        </div>
    );
}
