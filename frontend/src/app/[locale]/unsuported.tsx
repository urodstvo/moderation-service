'use client';

import React, { useEffect, useState } from 'react';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent;
        const mobile =
            /android|avantgo|blackberry|bb|meego|avantgo|bada\/|bb10|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od|ad)|iris|kindle|midp|mmp|mobile|nokia|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.browser|up\.link|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
                userAgent,
            );

        setIsMobile(mobile);
    }, []);

    return isMobile;
};

export const UnsuportedProvider = ({ children }: { children: React.ReactNode }) => {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#222222] to-[#000000]'>
                <h1 className='font-overpass font-black text-white text-center text-2xl'>
                    Our app is not supported on mobile devices.
                </h1>
                <p className='font-roboto text-white'>Go to the desktop version to continue.</p>
            </main>
        );
    }

    return children;
};
