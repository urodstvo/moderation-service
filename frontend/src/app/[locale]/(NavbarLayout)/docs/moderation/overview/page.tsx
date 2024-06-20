import { useTranslations } from 'next-intl';

import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

export default function ModerationOverviewPage() {
    const t = useTranslations('docs.overview');
    return (
        <main className='w-[66%]'>
            <h1 className='font-overpass text-4xl font-bold '>{t('title')}</h1>
            <section className='my-10'>
                <p className='font-roboto text-lg mb-5'>{t('1')}</p>
                <p className='font-roboto text-lg mb-5'>{t('2')}</p>
                <p className='font-roboto text-lg mb-5'>{t('3')}</p>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>{t('4')}</h2>
                <p className='font-roboto text-lg mb-5'>{t('5')}</p>
                <p className='font-roboto text-lg mb-5'>{t('6')}</p>
                <div className='my-5'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl w-[200px]'>{t('7')}</TableCell>
                                <TableCell className='font-medium font-overpass text-xl'>{t('8')}</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
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
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('15')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('16')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>{t('17')}</h2>
                <p className='font-roboto text-lg mb-5'>{t('18')}</p>
                <div className='my-5'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl w-[200px]'>{t('19')}</TableCell>
                                <TableCell className='font-medium font-overpass text-xl'>{t('20')}</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('21')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('22')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('23')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('24')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('25')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('26')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('27')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('28')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('29')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('30')}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>{t('31')}</TableCell>
                                <TableCell className='font-roboto text-lg'>{t('32')}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>
        </main>
    );
}
