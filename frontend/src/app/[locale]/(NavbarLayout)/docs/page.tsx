import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export default function IntroductionPage() {
    return (
        <main className='w-[66%]'>
            <h1 className='font-overpass text-4xl font-bold '>Introduction</h1>
            <p className='font-roboto text-lg'>Welcome to the Moderation Patform documentation!</p>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>What is the Moderation Platform?</h2>
                <p className='font-roboto text-lg'>
                    Our moderation platform is an integrated solution for controlling and managing content on online
                    platforms. It provides automated and human-centred moderation, content filtering and reputation
                    management, ensuring a safe and pleasant environment for users.
                </p>
                <p className='font-roboto text-lg'>
                    Under the bonnet of our platform also lies advanced artificial intelligence and machine learning
                    technology, which automates content discovery and analysis. This reduces the burden on moderators
                    and ensures a quick response to potentially harmful situations.
                </p>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>Main Features</h2>
                <p className='font-roboto text-lg'>Some of the main Moderation platform features include:</p>
                <div className='my-5'>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>
                                    Automated moderation
                                </TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    The platform provides a fully automated solution for content control, freeing the
                                    client from the need to set up and manage a moderation system.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>
                                    Multi-format content
                                </TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    Supports a variety of content formats, including text, graphics and multimedia,
                                    providing full control over all types of information on the platform.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>High efficiency</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    The platform is highly efficient and accurate in detecting and blocking unwanted
                                    content, ensuring a safe and quality user experience.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Cloud solution</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    The platform runs on cloud infrastructure, which ensures scalability, reliability
                                    and availability of the service at any time and from anywhere in the world.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>How to Use These Docs</h2>
                <p className='font-roboto text-lg'>
                    On the left side of the screen, you'll find the docs navbar. The pages of the docs are organized
                    sequentially, so you can follow them step-by-step when building your application. However, you can
                    read them in any order or skip to the pages that apply to your use case.
                </p>
            </section>
        </main>
    );
}
