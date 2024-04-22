import type { Meta, StoryObj } from '@storybook/react';

import { Typography } from './typography';

const meta: Meta<typeof Typography> = {
    component: Typography,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Typography>;

export const Primary: Story = {
    args: {
        children: 'Typography',
    },
};
