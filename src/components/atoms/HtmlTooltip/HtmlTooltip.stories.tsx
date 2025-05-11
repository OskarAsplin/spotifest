import { Button } from '@mui/material';
import type { Meta, StoryObj } from '@storybook/react';
import { HtmlTooltip } from './HtmlTooltip';

type Story = StoryObj<typeof HtmlTooltip>;

const meta: Meta<typeof HtmlTooltip> = {
  title: 'Atoms/HtmlTooltip',
  component: HtmlTooltip,
  parameters: {
    docs: {
      description: {
        component: 'Tooltip to show additional information on hover or click',
      },
    },
  },
  args: {
    title: 'The cake is a lie',
    children: <Button disabled>Hover here to find the truth!</Button>,
    placement: 'bottom',
  },
  argTypes: {
    children: { control: false },
    placement: {
      control: {
        type: 'select',
        options: [
          'bottom-end',
          'bottom-start',
          'bottom',
          'left-end',
          'left-start',
          'left',
          'right-end',
          'right-start',
          'right',
          'top-end',
          'top-start',
          'top',
        ],
      },
    },
  },
};

export default meta;

export const Primary: Story = {};
