import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@src/components/ui/button';
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
  },
  argTypes: {
    children: { control: false },
  },
};

export default meta;

export const Primary: Story = {};
