import { ComponentStory, ComponentMeta } from '@storybook/react';
import HtmlTooltip from './HtmlTooltip';

type Meta = ComponentMeta<typeof HtmlTooltip>;
type Story = ComponentStory<typeof HtmlTooltip>;

const meta: Meta = {
  title: 'Molecules/HtmlTooltip',
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
    children: <div>Hover here to find the truth!</div>,
  },
};

export default meta;

const Template: Story = (args) => <HtmlTooltip {...args} />;

export { Template as HtmlTooltip };
