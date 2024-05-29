'use client';

import React from 'react';

export const Timer = ({ seconds, children }: { seconds: number; children?: React.ReactNode }) => {
    const [time, setTime] = React.useState(seconds);

    const isHasChildren = !!children;
    const isZero = time === 0;

    React.useEffect(() => {
        let timer = setInterval(() => {
            setTime((time) => {
                if (time === 0) {
                    clearInterval(timer);
                    return 0;
                }
                return time - 1;
            });
        }, 1000);
    }, []);

    const timer = (
        <div>
            {`${Math.floor(time / 60)}`.padStart(2, '0')}:{`${time % 60}`.padStart(2, '0')}
        </div>
    );
    if (!isZero) return timer;

    if (isHasChildren) return <>{children}</>;
    return timer;
};
