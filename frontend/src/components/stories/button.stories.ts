import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '../ui/button';

const meta: Meta<typeof Button> = {
    title: 'components/Button',
    component: Button,
    tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
    args: {
        children: 'BUTTON',
    },
};
