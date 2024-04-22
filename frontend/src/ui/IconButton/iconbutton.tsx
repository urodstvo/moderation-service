import clsx from 'clsx';
import React, { forwardRef } from 'react';

type IconButtonVariant = 'filled' | 'subtle';
type IconButtonSize = 'compact' | 'default';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: IconButtonVariant;
    size?: IconButtonSize;
    loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, loading, variant = 'subtle', size = 'default', children, ...props }, ref) => {
        return (
            <button
                className={clsx(className, 'transition duration-200 ease-out rounded-[--border-radius] border-none', {
                    'bg-[--background-dark] hover:bg-[--background-dark-hover]': variant === 'filled',
                    'hover:bg-[--background-light-hover]': variant === 'subtle',
                    'p-1': size === 'compact',
                    'p-2': size === 'default',
                })}
                {...props}
                ref={ref}
            >
                {loading ? 'Loading...' : children}
            </button>
        );
    },
);
