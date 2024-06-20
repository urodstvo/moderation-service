import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function IntroductionPage() {
    const t = useTranslations('docs.introduction');
    return (
        <main className='w-[66%]'>
            <h1 className='font-overpass text-4xl font-bold '>{t('title')}</h1>
            <p className='font-roboto text-lg'>{t('1')}</p>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>{t('2')}</h2>
                <p className='font-roboto text-lg'>{t('3')}</p>
                <p className='font-roboto text-lg'>{t('4')}</p>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>{t('5')}</h2>
                <p className='font-roboto text-lg'>{t('6')}</p>
                <div className='my-5'>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('7')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('8')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('9')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('10')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('11')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('12')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('13')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('14')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>{t('15')}</h2>
                <p className='font-roboto text-lg'>{t('16')}</p>
            </section>
        </main>
    );
}
