import clsx from 'clsx';
import React from 'react';

type TypographyVariant = 'title' | 'regular' | 'large' | 'custom';
type TypographyTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'p';
export type TypographyProps<Tag extends TypographyTag> = React.ComponentProps<Tag> & {
    variant?: TypographyVariant;
    tag?: TypographyTag;
    children: React.ReactNode;
};

export const Typography = <Tag extends TypographyTag = 'div'>({
    tag = 'div',
    variant = 'custom',
    children,
    className,
    ...props
}: TypographyProps<Tag>) => {
    const Component = tag;
    return (
        <Component
            className={clsx(className, {
                'font-overpass text-[40px] font-bold': variant === 'title',
                'font-roboto text-xl': variant === 'regular',
                'font-roboto text-2xl': variant === 'large',
            })}
            {...props}
        >
            {children}
        </Component>
    );
};
