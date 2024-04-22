import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ComponentProps<'button'> {
    children: React.ReactNode;
    variant?: 'outline' | 'filled' | 'text';
    size?: 'compact' | 'default';
    loading?: boolean;
}
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ loading, children, className, variant = 'filled', size = 'default', ...props }, ref) => {
        return (
            <button
                className={clsx(
                    className,
                    'font-roboto font-bold rounded-[--border-radius] text-xl text-[--text-dark] transition duration-200 ease-out border-2',
                    {
                        'border-[--background-dark] bg-white/20 hover:bg-white/50': variant === 'outline',
                        'border-[--background-dark] bg-[--background-dark] text-[--text-light] hover:bg-[--background-dark-hover]':
                            variant === 'filled',
                        'border-transparent bg-transparent hover:underline': variant === 'text',
                        'px-5 py-[5px]': size === 'compact',
                        'px-10 py-5': size === 'default',
                    },
                )}
                {...props}
                ref={ref}
            >
                {loading ? 'Loading...' : children}
            </button>
        );
    },
);
