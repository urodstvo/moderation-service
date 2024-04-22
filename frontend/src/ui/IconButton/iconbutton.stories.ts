import type { Meta, StoryObj } from '@storybook/react';

import { IconButton } from './iconbutton';

const meta: Meta<typeof IconButton> = {
    component: IconButton,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
    args: {
        children: '😀',
        variant: 'subtle',
        size: 'default',
    },
};
