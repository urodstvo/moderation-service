import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';

export default function ModerationOverviewPage() {
    return (
        <main className='w-[66%]'>
            <h1 className='font-overpass text-4xl font-bold '>Moderation Service Overview</h1>
            <section className='my-10'>
                <p className='font-roboto text-lg mb-5'>
                    Our REST API service is a powerful tool for intelligent analysis of user content. The query format
                    supported by our service allows users to easily integrate it into their applications and systems.
                    Simply submit a request to the endpoint described below by providing an API key, and in response you
                    will receive accurate classification into predefined analysis classes.
                </p>
                <p className='font-roboto text-lg mb-5'>
                    Our service provides a high degree of classification accuracy and reliability by using advanced
                    machine learning algorithms. We are constantly updating and improving our model to provide our
                    clients with the highest level of results. Thanks to this, you can be sure of the quality and
                    reliability of the analyses obtained through our service.
                </p>
                <p className='font-roboto text-lg mb-5'>
                    Our REST API service is ideal for a wide range of tasks, including analysing text posts on social
                    networks, filtering content on forums, automating text processing and much more. Whether you need
                    analysis for business, research or security, our service is ready to offer a reliable and fast
                    solution.
                </p>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>API Request</h2>
                <p className='font-roboto text-lg mb-5'>
                    Our service provides a simple and intuitive API for sending requests and retrieving classified data.
                    The request API form includes data transfer via HTTP POST method. For text-based requests, you need
                    to specify the &quot;/text&quot; endpoint and pass the textual information in the body of the
                    request. For requests involving images, audio or video files, you must also specify the appropriate
                    endpoint (&quot;/image&quot;, &quot;/audio&quot; or &quot;/video&quot;) and send the appropriate
                    multimedia content.
                </p>
                <p className='font-roboto text-lg mb-5'>
                    API requests can be sent using standard HTTP headers, including an authentication header to ensure
                    the security of transmitted data. The response from the service is returned in JSON format and
                    contains categorised data according to the request type and specified categories. This simple and
                    efficient approach to sending and processing requests makes our service a convenient and flexible
                    tool for analysing text, images, audio and video content.
                </p>
                <div className='my-5'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl w-[200px]'>Endpoint</TableCell>
                                <TableCell className='font-medium font-overpass text-xl'>Description</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>/text</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    This endpoint is designed to analyse textual information. It allows you to send text
                                    queries and retrieve classified data about text content according to specified
                                    categories.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>/image</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    This endpoint provides the ability to analyse images. Users can send images for
                                    processing and get information about the text content of the image.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>/audio</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    This endpoint is designed to analyse audio files. It allows users to send audio
                                    recordings for analysis and get results about the content of the audio file,
                                    including speech recognition.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>/video</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    This endpoint provides the ability to analyse video files. Users can send video
                                    recordings for processing and get information about the audio content of the video.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>
            <section className='my-10'>
                <h2 className='font-overpass text-2xl font-bold'>API Answer</h2>
                <p className='font-roboto text-lg mb-5'>
                    Our service provides fast and accurate text analysis, returning results in JSON format. The
                    classification includes the following categories: &quot;Toxicity&quot;, &quot;Severe Toxicity&quot;,
                    &quot;Threat&quot;, &quot;Insult&quot;, &quot;Obscene&quot; and &quot;Identity Attack&quot;. Each
                    class represents a different aspect of content, identified by the content of the text, allowing
                    users to effectively identify and manage unwanted or dangerous content in their applications and
                    systems.
                </p>
                <div className='my-5'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl w-[200px]'>Class</TableCell>
                                <TableCell className='font-medium font-overpass text-xl'>Description</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Toxicity</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    Identifies the presence of elements in the text that may cause negative emotional
                                    reactions or offence to the reader.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Severe Toxicity</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    Identifies texts that contain highly offensive or insulting content that may pose a
                                    real threat or cause a serious negative impact on the audience.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Threat</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    Identifies threatening language or perceived threats in a text that may cause harm
                                    or anxiety to the reader.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Insult</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    Recognises texts that contain abusive or derogatory language about a person or
                                    group.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Obscene</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    Identifies texts containing obscene or vulgar language that may be inappropriate for
                                    the audience or environment in which it is used.
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className='font-medium font-overpass text-xl'>Identity Attack</TableCell>
                                <TableCell className='font-roboto text-lg'>
                                    dentifies texts that seek to attack or disparage a person or group of persons based
                                    on their race, gender, religion or other identifying characteristics.
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </section>
        </main>
    );
}
