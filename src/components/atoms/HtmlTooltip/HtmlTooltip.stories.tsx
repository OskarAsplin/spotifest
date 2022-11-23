import { ComponentStory, ComponentMeta } from '@storybook/react';
import HtmlTooltip from './HtmlTooltip';
import { Button } from '@mui/material';

type Meta = ComponentMeta<typeof HtmlTooltip>;
type Story = ComponentStory<typeof HtmlTooltip>;

const meta: Meta = {
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

const Template: Story = (args) => <HtmlTooltip {...args} />;

export { Template as HtmlTooltip };
