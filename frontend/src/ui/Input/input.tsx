import clsx from 'clsx';
import React from 'react';

interface InputProps extends React.ComponentProps<'input'> {
    leftSection?: React.ReactNode;
    rightSection?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ leftSection, rightSection, className, disabled, ...props }, ref) => {
        return (
            <div
                className={clsx(
                    className,
                    'p-1 text-xl rounded-[--border-radius] border-2 border-[--background-dark] flex gap-1 bg-white',
                    { 'cursor-not-allowed bg-[#eee]': disabled === true },
                )}
            >
                {leftSection}
                <input
                    className={clsx('outline-none size-full bg-transparent', {
                        'cursor-not-allowed text-gray-600': disabled === true,
                    })}
                    ref={ref}
                    disabled={disabled}
                    {...props}
                />
                {rightSection}
            </div>
        );
    },
);
